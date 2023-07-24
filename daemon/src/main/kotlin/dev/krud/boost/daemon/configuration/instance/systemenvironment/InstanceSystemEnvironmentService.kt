package dev.krud.boost.daemon.configuration.instance.systemenvironment

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.systemenvironment.ro.InstanceSystemEnvironmentRO
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.utils.ACTUATOR_REDACTED_STRING
import dev.krud.boost.daemon.utils.resolve
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceSystemEnvironmentService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityService: InstanceAbilityService,
    cacheManager: CacheManager
) {
    val instanceSystemEnvironmentCache by cacheManager.resolve()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                instanceSystemEnvironmentCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                instanceSystemEnvironmentCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                instanceSystemEnvironmentCache.evict(event.payload.instanceId)
            }
        }
    }

    @Cacheable("instanceSystemEnvironmentCache")
    fun getSystemEnvironment(instanceId: UUID): InstanceSystemEnvironmentRO {
        log.debug { "Get system envoronment for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.SYSTEM_ENVIRONMENT)
        val client = actuatorClientProvider.provide(instance)
        val (_, propertySources) = client.env()
            .getOrElse { throwInternalServerError("Unable to get system properties") }
        val systemProperties = propertySources.first { it.name == "systemEnvironment" }
        val properties = systemProperties.properties ?: throwInternalServerError("Unable to get system environment")
        var redactedCount = 0
        val propertiesMap = properties.entries.associate {
            if (it.value.value == ACTUATOR_REDACTED_STRING) {
                redactedCount++
            }
            it.key to it.value.value
        }

        val redactionPercentage = redactedCount.toDouble() / propertiesMap.size.toDouble() * 100.0
        log.debug { "System environment for instance $instanceId are redacted at rate of $redactionPercentage" }
        return InstanceSystemEnvironmentRO(
            propertiesMap,
            when {
                redactionPercentage == 100.0 -> InstanceSystemEnvironmentRO.RedactionLevel.FULL
                redactionPercentage > 0.0 -> InstanceSystemEnvironmentRO.RedactionLevel.PARTIAL
                else -> InstanceSystemEnvironmentRO.RedactionLevel.NONE
            }
        )
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}