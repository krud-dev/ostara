package dev.krud.boost.daemon.actuator.model

data class QuartzTriggersResponse(
    val groups: Map<String, Group>
) {
    data class Group(
        val paused: Boolean,
        val triggers: List<String>
    )
}