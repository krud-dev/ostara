package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility

abstract class AbstractPropertySourceAbilityResolver(
    override val ability: InstanceAbility,
    private val propertySourceName: String
) : InstanceAbilityResolver {
    override fun hasAbility(options: InstanceAbilityResolver.Options): Boolean {
        if (!options.endpoints.contains("env")) {
            return false
        }
        val client = options.actuatorClient
        val (_, propertySources) = client.env()
            .getOrElse {
                return false
            }
        return propertySources.any { it.name == propertySourceName }
    }
}