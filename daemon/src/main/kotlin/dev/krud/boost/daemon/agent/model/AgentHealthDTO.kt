package dev.krud.boost.daemon.agent.model

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import java.util.*

@GenerateTypescript
data class AgentHealthDTO(
    val statusCode: Int,
    val message: String?,
    val status: Status,
    val info: AgentInfoDTO? = null
) {
    object Codes {
        const val PENDING = -1
        const val UNREACHABLE = -2
        const val NOT_AGENT = -3
    }
    val time = Date()
    companion object {
        enum class Status {
            PENDING, UNHEALTHY, HEALTHY
        }

        fun pending(): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = Codes.PENDING,
                message = null,
                status = Status.PENDING
            )
        }
        fun unreachable(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = Codes.UNREACHABLE,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun notAgent(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = Codes.NOT_AGENT,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun ok(info: AgentInfoDTO, statusCode: Int = 200, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = statusCode,
                message = statusText,
                status = Status.HEALTHY,
                info = info
            )
        }

        fun error(statusCode: Int, statusText: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = statusCode,
                message = statusText,
                status = Status.UNHEALTHY
            )
        }
    }
}