package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.test.TestKrud
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import strikt.api.expectThat
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.isFailure
import java.util.*

class AgentDiscoveryServiceTest {
    private val agentService = mock<AgentService>()
    private val applicationService = mock<ApplicationService>()
    private val applicationKrud = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val agentClientProvider = mock<AgentClientProvider>()
    private val agentDiscoveryService = AgentDiscoveryService(agentService, applicationService, agentClientProvider, applicationKrud, instanceKrud)

    @Test
    fun `runDiscoveryForApplication should fail if agent or discovery type not set`() {
        val application = applicationKrud.create(stubApplication())
        val result = agentDiscoveryService.runDiscoveryForApplication(application)
        expectThat(result)
            .isFailure()
            .isA<ResponseStatusException>()
            .and {
                get { statusCode } isEqualTo HttpStatus.BAD_REQUEST
            }
    }
}