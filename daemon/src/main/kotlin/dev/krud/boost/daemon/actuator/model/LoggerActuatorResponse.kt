package dev.krud.boost.daemon.actuator.model

data class LoggerActuatorResponse(
    val effectiveLevel: String? = null,
    val configuredLevel: String? = null,
    val members: List<String>? = emptyList()
)