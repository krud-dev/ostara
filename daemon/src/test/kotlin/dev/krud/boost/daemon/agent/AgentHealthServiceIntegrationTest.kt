package dev.krud.boost.daemon.agent

import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import dev.krud.boost.daemon.IntegrationTest
import dev.krud.boost.daemon.agent.messaging.AgentHealthUpdatedEventMessage
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.test.awaitOrThrow
import dev.krud.crudframework.crud.handler.krud.Krud
import feign.FeignException
import feign.Request
import feign.RetryableException
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.test.annotation.DirtiesContext
import strikt.api.expect
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import strikt.assertions.isNull
import java.lang.RuntimeException
import java.util.*
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

@IntegrationTest
@DirtiesContext
class AgentHealthServiceIntegrationTest {
    @Autowired
    private lateinit var agentHealthService: AgentHealthService

    @Autowired
    private lateinit var agentKrud: Krud<Agent, UUID>

    @Autowired
    private lateinit var agentHealthChannel: PublishSubscribeChannel

    @MockBean
    private lateinit var agentClientProvider: AgentClientProvider

    private val agentClient = mock<AgentClient>()

    private lateinit var theAgent: Agent

    @BeforeEach
    fun setUp() {
        theAgent = agentKrud.create(stubAgent())
        whenever(agentClientProvider.getAgentClient(theAgent)).thenReturn(agentClient)
    }

    @AfterEach
    fun tearDown() {
        agentKrud.delete(theAgent)
    }

    @Test
    fun `fetchAgentHealth should return healthy if agent is healthy`() {
        val info = AgentInfoDTO("1.2.3", setOf("Internal"))
        primeInfoSuccess(info)
        val health = agentHealthService.fetchAgentHealth(theAgent.id)
        expect {
            that(health.info).isEqualTo(info)
            that(health.statusCode).isEqualTo(200)
            that(health.status).isEqualTo(AgentHealthDTO.Companion.Status.HEALTHY)
            that(health.message).isNull()
        }
    }

    @Test
    fun `fetchAgentHealth should return unhealthy if agent is unreachable`() {
        primeInfoUnreachableError()
        val health = agentHealthService.fetchAgentHealth(theAgent.id)
        expect {
            that(health.info).isNull()
            that(health.statusCode).isEqualTo(-2)
            that(health.status).isEqualTo(AgentHealthDTO.Companion.Status.UNHEALTHY)
            that(health.message).isEqualTo("Unreachable!")
        }
    }

    @Test
    fun `fetchAgentHealth should return unhealthy if url is determined not to be an agent`() {
        primeInfoBadPayloadError()
        val health = agentHealthService.fetchAgentHealth(theAgent.id)
        expect {
            that(health.info).isNull()
            that(health.statusCode).isEqualTo(-3)
            that(health.status).isEqualTo(AgentHealthDTO.Companion.Status.UNHEALTHY)
        }
    }

    @Test
    fun `fetchAgentHealth should return unhealthy if arbitrary non feign exception is received`() {
        primeUnknownError()
        val health = agentHealthService.fetchAgentHealth(theAgent.id)
        expect {
            that(health.info).isNull()
            that(health.statusCode).isEqualTo(-4)
            that(health.status).isEqualTo(AgentHealthDTO.Companion.Status.UNHEALTHY)
        }
    }

    @Test
    fun `agent health change should fire event`() {
        val info = AgentInfoDTO("1.2.3", setOf("Internal"))
        primeInfoSuccess(info)
        val latch = CountDownLatch(1)
        var message: AgentHealthUpdatedEventMessage? = null
        agentHealthChannel.subscribe {
            message = it as AgentHealthUpdatedEventMessage
            latch.countDown()
        }
        val health = agentHealthService.refreshAgentHealth(theAgent)
        latch.awaitOrThrow(1000, TimeUnit.MILLISECONDS)
        expect {
            that(message).isNotNull()
            that(message!!.payload.agentId).isEqualTo(theAgent.id)
            that(message!!.payload.oldHealth.status).isEqualTo(AgentHealthDTO.Companion.Status.PENDING)
            that(message!!.payload.newHealth).isEqualTo(health)
        }
    }

    private fun primeInfoSuccess(info: AgentInfoDTO) {
        whenever(agentClient.getAgentInfo(theAgent.apiKey)).thenReturn(
            info
        )
    }

    private fun primeInfoUnreachableError() {
        whenever(agentClient.getAgentInfo(theAgent.apiKey)).thenThrow(RetryableException(
            -1,
            "Unreachable!",
            Request.HttpMethod.GET,
            null,
            mock()
        ))
    }

    private fun primeInfoBadPayloadError() {
        val theException = object : FeignException(200, "OK", mock<MissingKotlinParameterException>()) {}
        whenever(agentClient.getAgentInfo(theAgent.apiKey)).thenThrow(theException)
    }

    private fun primeUnknownError() {
        whenever(agentClient.getAgentInfo(theAgent.apiKey)).thenThrow(
            RuntimeException("¯\\_(ツ)_/¯")
        )
    }
}