package dev.krud.boost.daemon.agent.validation

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.stubAgent
import dev.krud.boost.daemon.test.TestKrud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue
import java.util.*

class AgentIdOrNullValidatorTest {
    private val agentKrud = TestKrud(Agent::class.java) { UUID.randomUUID() }
    private val validator = AgentIdOrNullValidator(agentKrud)

    @Test
    fun `validator should return true if null`() {
        expectThat(validator.isValid(null, mock()))
            .isTrue()
    }

    @Test
    fun `validator should return true if agent exists`() {
        val agent = agentKrud.create(stubAgent())
        expectThat(validator.isValid(agent.id, mock()))
            .isTrue()
    }

    @Test
    fun `validator should return false if agent does not exist`() {
        val agentId = UUID.randomUUID()
        expectThat(validator.isValid(agentId, mock()))
            .isFalse()
    }
}