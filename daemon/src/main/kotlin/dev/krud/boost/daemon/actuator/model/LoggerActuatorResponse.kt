package dev.krud.boost.daemon.actuator.model

import org.springframework.boot.logging.LogLevel

data class LoggerActuatorResponse(
    val effectiveLevel: LogLevel?,
    val configuredLevel: LogLevel?,
    val members: List<String>?
)