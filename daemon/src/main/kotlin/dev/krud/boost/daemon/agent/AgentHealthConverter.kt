package dev.krud.boost.daemon.agent

import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import feign.FeignException
import feign.RetryableException
import org.springframework.core.convert.converter.Converter
import org.springframework.stereotype.Component
import java.net.ConnectException
import javax.net.ssl.SSLException

@Component
class AgentHealthConverter : Converter<Throwable, AgentHealthDTO> {
    override fun convert(source: Throwable): AgentHealthDTO {
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
}