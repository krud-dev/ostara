package dev.krud.boost.daemon.configuration.instance.property

import com.cobber.fta.dates.DateTimeParser
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ArrayNode
import com.fasterxml.jackson.module.kotlin.kotlinModule
import com.github.wnameless.json.flattener.JsonFlattener
import com.github.wnameless.json.unflattener.JsonUnflattener
import dev.krud.boost.daemon.actuator.model.ConfigPropsActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.property.ro.InstancePropertyRO
import dev.krud.boost.daemon.jackson.MultiDateParsingModule
import dev.krud.boost.daemon.utils.toCalendar
import dev.krud.boost.daemon.utils.toDate
import net.pearx.kasechange.toKebabCase
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.format.DateTimeFormatterBuilder
import java.time.temporal.ChronoField
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
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.PROPERTIES)
        val actuatorClient = actuatorClientProvider.provide(instance)
        val configProps = actuatorClient.configProps().getOrThrow()
        val contexts = mutableMapOf<String, Map<String, Any>>()

        for ((contextName, context) in configProps.contexts) {
            val flattened = context.beans.values.flattenProperties()
            contexts[contextName] = JsonUnflattener(flattened).unflattenAsMap()
        }
        return InstancePropertyRO(contexts)
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
}