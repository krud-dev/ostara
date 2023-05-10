package dev.krud.boost.daemon.actuator.model

data class TogglzFeatureUpdateRequest(
    val name: String,
    val enabled: Boolean
)