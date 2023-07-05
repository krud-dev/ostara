package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.messaging.AgentMovedEventMessage
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.runFeignCatching
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Service
import java.util.*

@Service
class AgentService(
    private val agentKrud: Krud<Agent, UUID>,
    private val agentClientProvider: AgentClientProvider,
    private val systemEventsChannel: PublishSubscribeChannel,
) {
    fun getAgent(agentId: UUID): Agent? {
        return agentKrud.showById(agentId)
    }

    fun getAgentOrThrow(agentId: UUID): Agent {
        return getAgent(agentId) ?: throwNotFound("Agent with id $agentId not found")
    }

    fun getAgentInfo(agentId: UUID): Result<AgentInfoDTO> = runFeignCatching {
        val agent = getAgentOrThrow(agentId)
        getAgentInfo(agent).getOrThrow()
    }

    fun getAgentInfo(agent: Agent): Result<AgentInfoDTO> = runFeignCatching {
        agentClientProvider.getAgentClient(agent)
            .getAgentInfo(agent.apiKey)
    }

    fun getAgentInfo(url: String, apiKey: String?): Result<AgentInfoDTO> = runFeignCatching {
        agentClientProvider.getAgentClient(url)
            .getAgentInfo(apiKey)
    }

    fun moveAgent(agentId: UUID, newParentFolderId: UUID?, newSort: Double?): Agent {
        log.debug { "Moving agent $agentId to folder $newParentFolderId with sort $newSort" }
        val agent = getAgentOrThrow(agentId)
        if (agent.parentFolderId == newParentFolderId && agent.sort == newSort) {
            log.debug { "Agent $agentId is already in folder $newParentFolderId with sort $newSort, skipping update" }
            return agent
        }
        agent.parentFolderId = newParentFolderId
        agent.sort = newSort
        val updatedAgent = agentKrud.update(agent)
        systemEventsChannel.send(AgentMovedEventMessage(AgentMovedEventMessage.Payload(agentId, agent.parentFolderId, newParentFolderId, newSort)))
        return updatedAgent
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}