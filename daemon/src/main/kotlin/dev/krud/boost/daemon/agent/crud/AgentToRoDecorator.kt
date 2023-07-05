package dev.krud.boost.daemon.agent.crud

import dev.krud.boost.daemon.agent.AgentHealthService
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.agent.ro.AgentRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class AgentToRoDecorator(
    @Lazy
    private val agentHealthService: AgentHealthService
) : MappingDecorator<Agent, AgentRO> {
    override fun decorate(context: MappingDecoratorContext<Agent, AgentRO>) {
        context.to.health = agentHealthService.getCachedHealth(context.from.id)
            ?: AgentHealthDTO.pending(context.from.id)
    }
}