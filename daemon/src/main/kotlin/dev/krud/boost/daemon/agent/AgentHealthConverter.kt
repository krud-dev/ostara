package dev.krud.boost.daemon.agent

import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import com.vdurmont.semver4j.Semver
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import feign.FeignException
import feign.RetryableException
import org.springframework.stereotype.Component
import java.net.ConnectException
import javax.net.ssl.SSLException

@Component
class AgentHealthConverter {
    fun convertInfo(source: AgentInfoDTO): AgentHealthDTO {
        val agentSemver = source.version.toSemver()
        if (agentSemver == null || !agentSemver.satisfies(SUPPORTED_AGENT_VERSION_RANGE)) {
            return AgentHealthDTO.notSupported(
                source,
                SUPPORTED_AGENT_VERSION_RANGE
            )
        }
        return AgentHealthDTO.ok(source)
    }

    fun convertException(source: Throwable): AgentHealthDTO {
        return when (source) {
            is RetryableException -> {
                when (source.cause) {
                    is SSLException -> AgentHealthDTO.sslError(source.cause?.message)
                    is ConnectException -> AgentHealthDTO.unreachable(source.cause?.message)
                    else -> AgentHealthDTO.error(message = source.message)
                }
            }
            is FeignException -> {
                if (source.cause is MissingKotlinParameterException) {
                    AgentHealthDTO.notAgent()
                } else {
                    AgentHealthDTO.error(source.status(), source.message)
                }
            }
            else -> AgentHealthDTO.error(message = source.message)
        }
    }

    companion object {
        const val SUPPORTED_AGENT_VERSION_RANGE = ">=0.0.1"
        private fun String?.toSemver(): Semver? {
            return this?.let { Semver(it, Semver.SemverType.NPM) }
        }
    }
}