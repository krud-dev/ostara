package dev.krud.boost.daemon.agent.model

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import java.util.*

@GenerateTypescript
data class AgentHealthDTO(
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

        fun pending(): AgentHealthDTO {
            return AgentHealthDTO(
                reachable = false,
                statusCode = -1,
                message = null,
                status = Status.PENDING
            )
        }
        fun unreachable(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                reachable = false,
                statusCode = -1,
                message = message,
                status = Status.UNHEALTHY
            )
        }
        fun ok(info: AgentInfoDTO, statusCode: Int = 200, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                info = info,
                reachable = true,
                statusCode = statusCode,
                message = statusText,
                status = Status.HEALTHY
            )
        }

        fun error(statusCode: Int, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                reachable = true,
                statusCode = statusCode,
                message = statusText,
                status = Status.UNHEALTHY
            )
        }
    }
}