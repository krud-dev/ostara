package dev.krud.boost.daemon.agent.crud

import dev.krud.boost.daemon.agent.AgentHealthService
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.agent.ro.AgentRO
import dev.krud.boost.daemon.agent.stubAgent
import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.whenever
import strikt.api.expect
import strikt.assertions.isEqualTo

class AgentToRoDecoratorTest {
    private val agentHealthService = mock<AgentHealthService>()
    private val shapeShift = ShapeShiftBuilder().build()
    private val decorator = AgentToRoDecorator(
        agentHealthService
    )
    @Test
    fun `decorate should set the agent cached health to the RO`() {
        val agent = stubAgent()
        val ro = AgentRO()
        val health = AgentHealthDTO.unreachable()
        whenever(agentHealthService.getCachedHealth(agent.id)).thenReturn(
            health
        )
        decorator.decorate(
            MappingDecoratorContext(
                agent,
                ro,
                shapeShift
            )
        )
        expect {
            that(ro.health).isEqualTo(health)
        }
    }

    @Test
    fun `decorate should set health to pending if cached health is null`() {
        val agent = stubAgent()
        val ro = AgentRO()
        decorator.decorate(
            MappingDecoratorContext(
                agent,
                ro,
                shapeShift
            )
        )
        expect {
            that(ro.health).isEqualTo(AgentHealthDTO.pending())
        }
    }
}