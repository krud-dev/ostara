package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.runFeignCatching
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.stereotype.Service
import java.util.*

@Service
class AgentService(
    private val agentKrud: Krud<Agent, UUID>,
    private val agentClientProvider: AgentClientProvider
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
            .getAgentInfo()
    }
}