package dev.krud.boost.daemon.actuator.model

import org.springframework.boot.logging.LogLevel

data class LoggerActuatorResponse(
    val effectiveLevel: LogLevel? = null,
    val configuredLevel: LogLevel? = null,
    val members: List<String>? = emptyList()
)