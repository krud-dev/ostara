package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.exception.throwBadRequest
import java.util.*

interface InstanceAbilityService {
    fun getAbilities(id: UUID): Set<InstanceAbility>
    fun getAbilities(instance: Instance): Set<InstanceAbility>
    fun hasAbility(instance: Instance, vararg abilities: InstanceAbility): Boolean {
        val currentAbilities = getAbilities(instance)
        return abilities.all { ability ->
            currentAbilities.contains(ability)
        }
    }

    fun hasAbilityOrThrow(instance: Instance, vararg abilities: InstanceAbility) {
        if (!hasAbility(instance, *abilities)) {
            throwBadRequest("Instance ${instance.id} does not have one or more abilities '${abilities.joinToString(", ")}'")
        }
    }

}