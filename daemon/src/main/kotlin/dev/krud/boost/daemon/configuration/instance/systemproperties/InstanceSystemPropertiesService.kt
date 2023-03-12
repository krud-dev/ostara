package dev.krud.boost.daemon.configuration.instance.systemproperties

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.systemproperties.ro.InstanceSystemPropertiesRO
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.utils.ACTUATOR_REDACTED_STRING
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceSystemPropertiesService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityService: InstanceAbilityService,
    cacheManager: CacheManager
) {
    val applicationSystemPropertiesCache by cacheManager.resolve()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                applicationSystemPropertiesCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                applicationSystemPropertiesCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                applicationSystemPropertiesCache.evict(event.payload.instanceId)
            }
        }
    }

    @Cacheable("applicationSystemPropertiesCache")
    fun getSystemProperties(instanceId: UUID): InstanceSystemPropertiesRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.SYSTEM_PROPERTIES)
        val client = actuatorClientProvider.provide(instance)
        val (_, propertySources) = client.env()
            .getOrElse { throwInternalServerError("Unable to get system properties") }
        val systemProperties = propertySources.first { it.name == "systemProperties" }
        val properties = systemProperties.properties ?: throwInternalServerError("Unable to get system properties")
        var redactedCount = 0
        val propertiesMap = properties.entries.associate {
            if (it.value.value == ACTUATOR_REDACTED_STRING) {
                redactedCount++
            }
            it.key to it.value.value
        }
        val redactionPercentage = redactedCount.toDouble() / properties.size.toDouble() * 100.0
        return InstanceSystemPropertiesRO(
            propertiesMap,
            when {
                redactionPercentage == 100.0 -> InstanceSystemPropertiesRO.RedactionLevel.FULL
                redactionPercentage > 0.0 -> InstanceSystemPropertiesRO.RedactionLevel.PARTIAL
                else -> InstanceSystemPropertiesRO.RedactionLevel.NONE
            }
        )
    }
}