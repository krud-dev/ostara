package dev.krud.boost.daemon.actuator.model

data class TogglzFeatureActuatorResponse(
    val name: String,
    val enabled: Boolean,
    val strategy: String?,
    val params: Map<String, String?>?
)

