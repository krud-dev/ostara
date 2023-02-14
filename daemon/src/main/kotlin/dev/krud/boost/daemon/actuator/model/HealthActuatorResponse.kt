package dev.krud.boost.daemon.actuator.model

data class HealthActuatorResponse(
    val status: Status,
    val components: Map<String, Component>,
    val groups: List<String>?
)  {
    enum class Status {
        UP, DOWN, OUT_OF_SERVICE, UNKNOWN
    }

    data class Component(
        val status: Status,
        val description: String?,
        val components: Map<String, Component>?,
        val details: Map<String, Any>
    )
}