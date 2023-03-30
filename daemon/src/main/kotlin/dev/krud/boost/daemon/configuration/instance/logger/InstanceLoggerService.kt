package dev.krud.boost.daemon.configuration.instance.logger

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.logger.ro.InstanceLoggerRO
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
}