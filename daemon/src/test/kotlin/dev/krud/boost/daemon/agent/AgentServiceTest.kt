package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.test.TestKrud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.isEqualTo
import strikt.assertions.isNull
import java.util.*

class AgentServiceTest {
    private val agentKrud = TestKrud(Agent::class.java) { UUID.randomUUID() }
    private val agentClientProvider = mock<AgentClientProvider>()
    private val agentService = AgentService(agentKrud, agentClientProvider)

    @Test
    fun `getAgent should return agent if exists`() {
        val agent = agentKrud.create(stubAgent())
        val result = agentService.getAgent(agent.id)
        expectThat(result)
            .isEqualTo(agent)
    }

    @Test
    fun `getAgent should return null if not exists`() {
        val result = agentService.getAgent(UUID.randomUUID())
        expectThat(result).isNull()
    }

    @Test
    fun `getAgentOrThrow should return agent if exists`() {
        val agent = agentKrud.create(stubAgent())
        val result = agentService.getAgentOrThrow(agent.id)
        expectThat(result)
            .isEqualTo(agent)
    }

    @Test
    fun `getAgentOrThrow should throw if not exists`() {
        val id = UUID.randomUUID()
        expectThrows<ResponseStatusException> {
            agentService.getAgentOrThrow(id)
        }.and {
            get { statusCode } isEqualTo HttpStatus.NOT_FOUND
            get { reason } isEqualTo "Agent with id $id not found"
        }
    }
}