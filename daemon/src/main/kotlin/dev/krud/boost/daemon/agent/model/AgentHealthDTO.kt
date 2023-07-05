package dev.krud.boost.daemon.agent.model

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import java.util.*

@GenerateTypescript
data class AgentHealthDTO(
    val agentId: UUID,
    val reachable: Boolean,
    val statusCode: Int,
    val message: String?,
    val status: Status,
    val info: AgentInfoDTO? = null
) {
    val time = Date()
    companion object {
        enum class Status {
            PENDING, UNHEALTHY, HEALTHY
        }

        fun pending(agentId: UUID): AgentHealthDTO {
            return AgentHealthDTO(
                agentId = agentId,
                reachable = false,
                statusCode = -1,
                message = null,
                status = Status.PENDING
            )
        }
        fun unreachable(agentId: UUID, message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                agentId,
                reachable = false,
                statusCode = -1,
                message = message,
                status = Status.UNHEALTHY
            )
        }
        fun ok(agentId: UUID, info: AgentInfoDTO, statusCode: Int = 200, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                agentId,
                info = info,
                reachable = true,
                statusCode = statusCode,
                message = statusText,
                status = Status.HEALTHY
            )
        }

        fun error(agentId: UUID, statusCode: Int, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                agentId,
                reachable = true,
                statusCode = statusCode,
                message = statusText,
                status = Status.UNHEALTHY
            )
        }
    }
}