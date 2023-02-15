package dev.krud.boost.daemon.configuration.instance.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import java.util.*

class InstanceRO(
    val id: UUID,
    val alias: String,
    var actuatorUrl: String,
    val dataCollectionIntervalSeconds: Int,
    val description: String? = null,
    val color: String = DEFAULT_COLOR,
    var effectiveColor: String = DEFAULT_COLOR,
    val icon: String? = null,
    val sort: Int? = null,
    val parentApplicationId: UUID? = null,
    var abilities: Set<InstanceAbility> = emptySet(),
    var health: InstanceHealthRO = InstanceHealthRO.unknown()
)