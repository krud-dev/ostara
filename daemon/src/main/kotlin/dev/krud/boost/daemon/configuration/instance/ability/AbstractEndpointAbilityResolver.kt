package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility

/**
 * An [InstanceAbilityResolver] that resolves an ability based on the presence of an endpoint.
 */

sealed class AbstractEndpointAbilityResolver(override val ability: InstanceAbility, private val endpoint: String) : InstanceAbilityResolver {
    override fun hasAbility(options: InstanceAbilityResolver.Options): Boolean {
        return options.endpoints.contains(endpoint)
    }
}