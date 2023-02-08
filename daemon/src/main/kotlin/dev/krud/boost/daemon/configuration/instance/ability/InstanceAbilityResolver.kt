package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility

sealed interface InstanceAbilityResolver {
    val ability: InstanceAbility
    fun hasAbility(options: Options): Boolean

    data class Options(
        val instance: Instance,
        val endpoints: Set<String>,
        val actuatorClient: ActuatorHttpClient
    )
}