package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class QuartzTriggersResponse(
    val groups: Map<String, Group> = emptyMap()
) {
    data class Group(
        val paused: Boolean = TypeDefaults.BOOLEAN,
        val triggers: List<String> = emptyList()
    )
}