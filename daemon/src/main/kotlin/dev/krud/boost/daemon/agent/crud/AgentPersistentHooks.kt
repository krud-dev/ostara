package dev.krud.boost.daemon.agent.crud

import dev.krud.boost.daemon.agent.messaging.AgentAuthenticationChangedMessage
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.CreateHooks
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateHooks
import org.springframework.cache.CacheManager
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.messaging.support.GenericMessage
import org.springframework.stereotype.Component
import java.util.*

@Component
class AgentPersistentHooks(
    private val applicationKrud: Krud<Application, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel,
    private val agentHealthCheckRequestChannel: QueueChannel,
    private val cacheManager: CacheManager
) : DeleteHooks<UUID, Agent>, UpdateHooks<UUID, Agent>, CreateHooks<UUID, Agent> {
    val agentEffectiveAuthenticationCache by cacheManager.resolve()
    override fun postUpdate(entity: Agent) {
        val copy = entity.saveOrGetCopy() as Agent
        if (copy.authentication != entity.authentication) {
            systemEventsChannel.send(
                AgentAuthenticationChangedMessage(
                    AgentAuthenticationChangedMessage.Payload(entity.id)
                )
            )
        }
        agentEffectiveAuthenticationCache.evict(entity.id)
        agentHealthCheckRequestChannel.send(
            GenericMessage(entity.id)
        )
    }

    override fun postCreate(entity: Agent) {
        agentHealthCheckRequestChannel.send(
            GenericMessage(entity.id)
        )
    }

    override fun onDelete(entity: Agent) {
        applicationKrud.deleteByFilter {
            where {
                Application::parentAgentId Equal entity.id
            }
        }
    }
}