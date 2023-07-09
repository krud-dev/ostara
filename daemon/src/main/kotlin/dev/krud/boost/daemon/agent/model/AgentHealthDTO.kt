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
    val time = Date()
    companion object {
        const val UNKNOWN = -999
        const val PENDING = -1
        const val UNREACHABLE = -2
        const val NOT_AGENT = -3
        const val SSL_ERROR = -4
        const val AGENT_NOT_SUPPORTED = -5

        enum class Status {
            PENDING, UNHEALTHY, HEALTHY
        }

        fun pending(): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = PENDING,
                message = null,
                status = Status.PENDING
            )
        }
        fun unreachable(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = UNREACHABLE,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun sslError(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = SSL_ERROR,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun notAgent(message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = NOT_AGENT,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun ok(info: AgentInfoDTO, statusCode: Int = 200, message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = statusCode,
                message = message,
                status = Status.HEALTHY,
                info = info
            )
        }

        fun error(statusCode: Int = UNKNOWN, message: String? = null): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = statusCode,
                message = message,
                status = Status.UNHEALTHY
            )
        }

        fun notSupported(info: AgentInfoDTO, supportedVersionRange: String): AgentHealthDTO {
            return AgentHealthDTO(
                statusCode = AGENT_NOT_SUPPORTED,
                message = "Agent version ${info.version} is not supported, required version range is $supportedVersionRange",
                status = Status.UNHEALTHY,
                info = info
            )
        }
    }
}