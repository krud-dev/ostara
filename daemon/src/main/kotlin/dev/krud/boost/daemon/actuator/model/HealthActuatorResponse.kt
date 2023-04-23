package dev.krud.boost.daemon.actuator.model

data class HealthActuatorResponse(
    val status: Status = Status.UNKNOWN,
    val components: Map<String, Component>? = null,
    val groups: List<String>? = null,
    val details: Map<String, Any>? = null
) {
    enum class Status {
        UP, DOWN, OUT_OF_SERVICE, UNKNOWN
    }

    data class Component(
        val status: Status = Status.UNKNOWN,
        val description: String? = null,
        val components: Map<String, Component>? = null,
        val details: Map<String, Any>? = null
    )
}