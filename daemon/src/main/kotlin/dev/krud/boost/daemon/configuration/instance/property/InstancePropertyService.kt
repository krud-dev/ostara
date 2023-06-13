package dev.krud.boost.daemon.configuration.instance.property

import com.fasterxml.jackson.databind.ObjectMapper
import com.github.wnameless.json.flattener.JsonFlattener
import com.github.wnameless.json.unflattener.JsonUnflattener
import dev.krud.boost.daemon.actuator.model.ConfigPropsActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.property.ro.InstancePropertyRO
import dev.krud.boost.daemon.utils.ACTUATOR_REDACTED_STRING
import io.github.oshai.kotlinlogging.KotlinLogging
import net.pearx.kasechange.toKebabCase
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstancePropertyService(
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceService: InstanceService,
    private val instanceAbilityService: InstanceAbilityService,
    private val objectMapper: ObjectMapper
) {
    @Cacheable(cacheNames = ["instancePropertyCache"], key = "#instanceId")
    fun getProperties(instanceId: UUID): InstancePropertyRO {
        log.debug { "Get properties for instance $instanceId" }
        var propertyCount = 0
        var redactedCount = 0
        var emptyArrayOrObjectCount = 0
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.PROPERTIES)
        val actuatorClient = actuatorClientProvider.provide(instance)
        val configProps = actuatorClient.configProps().getOrThrow()
        val contexts = mutableMapOf<String, Map<String, Any>>()

        for ((contextName, context) in configProps.contexts) {
            val flattened = context.beans.values.flattenProperties()
            flattened.forEach { (_, value) ->
                propertyCount++
                if (value == ACTUATOR_REDACTED_STRING) {
                    redactedCount++
                } else {
                    if ((value is List<*> && value.isEmpty()) || (value is Map<*, *> && value.isEmpty())) {
                        emptyArrayOrObjectCount++
                    }
                }
            }
            contexts[contextName] = JsonUnflattener(flattened).unflattenAsMap()
        }
        val redactionPercentage = redactedCount.toDouble() / (propertyCount.toDouble() - emptyArrayOrObjectCount.toDouble()) * 100.0
        log.debug { "Properties for instance $instanceId are redacted at rate of $redactionPercentage" }
        return InstancePropertyRO(
            contexts,
            when {
                redactionPercentage == 100.0 -> InstancePropertyRO.RedactionLevel.FULL
                redactionPercentage > 0.0 -> InstancePropertyRO.RedactionLevel.PARTIAL
                else -> InstancePropertyRO.RedactionLevel.NONE
            }
        )
    }

    private fun Collection<ConfigPropsActuatorResponse.Context.Bean>.flattenProperties(): Map<String, Any> {
        val map = mutableMapOf<String, Any>()
        forEach { bean ->
            val flattened = JsonFlattener(objectMapper.writeValueAsString(bean.properties))
                .ignoreReservedCharacters()
                .withKeyTransformer {
                    it.toKebabCase()
                }
                .flattenAsMap()
                .mapKeys {
                    "${bean.prefix}.${it.key}"
                }
            map.putAll(flattened)
        }
        return map
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}