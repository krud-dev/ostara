package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityResolver
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Service

@Service
class InstanceService(
    private val instanceAbilityResolvers: List<InstanceAbilityResolver>,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {
    /**
     * Resolves the abilities of an instance.
     */
    // TODO: cache
    fun resolveAbilities(instance: Instance): Set<InstanceAbility> {
        val actuatorClient = actuatorClientProvider.provide(instance)
        val endpoints = actuatorClient.endpoints()
        val options = InstanceAbilityResolver.Options(instance, endpoints, actuatorClient)
        return instanceAbilityResolvers
            .filter { it.hasAbility(
                options
            ) }
            .map { it.ability }
            .toSet()
    }
}