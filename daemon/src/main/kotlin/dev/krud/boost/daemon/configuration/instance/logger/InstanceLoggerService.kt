package dev.krud.boost.daemon.configuration.instance.logger

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.logger.ro.InstanceLoggerRO
import io.github.oshai.KotlinLogging
import org.springframework.boot.logging.LogLevel
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceLoggerService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityService: InstanceAbilityService
) {
    fun getLoggers(instanceId: UUID): List<InstanceLoggerRO> {
        log.debug { "Get loggers for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.LOGGERS)
        val response = actuatorClientProvider.doWith(instance) {
            it.loggers().getOrThrow()
        }

        return response.loggers.map { (name, logger) ->
            InstanceLoggerRO(
                name = name,
                effectiveLevel = logger.effectiveLevel,
                configuredLevel = logger.configuredLevel
            )
        }
    }

    fun getLogger(instanceId: UUID, loggerName: String): InstanceLoggerRO {
        log.debug { "Get logger for instance $instanceId and logger name $loggerName" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.LOGGERS)
        val response = actuatorClientProvider.doWith(instance) {
            it.logger(loggerName).getOrThrow()
        }

        return InstanceLoggerRO(
            name = loggerName,
            effectiveLevel = response.effectiveLevel,
            configuredLevel = response.configuredLevel
        )
    }

    fun setLoggerLevel(instanceId: UUID, loggerName: String, level: LogLevel?): InstanceLoggerRO {
        log.debug { "Update log level for instance $instanceId and logger name $loggerName, set to $level" }
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.LOGGERS)
        return actuatorClientProvider.doWith(instance) {
            it.updateLogger(loggerName, level)
        }
            .mapCatching {
                getLogger(instanceId, loggerName)
            }
            .getOrThrow()
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}