package dev.krud.boost.daemon.configuration.instance.property

import com.github.wnameless.json.flattener.JsonFlattener
import com.github.wnameless.json.unflattener.JsonUnflattener
import com.google.gson.GsonBuilder
import dev.krud.boost.daemon.actuator.model.ConfigPropsActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.property.ro.InstancePropertyRO
import net.pearx.kasechange.toKebabCase
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstancePropertyService(
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceService: InstanceService,
    private val instanceAbilityService: InstanceAbilityService
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
            val flattened = JsonFlattener(GSON.toJson(bean.properties))
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
        private val GSON = GsonBuilder().create()
    }
}