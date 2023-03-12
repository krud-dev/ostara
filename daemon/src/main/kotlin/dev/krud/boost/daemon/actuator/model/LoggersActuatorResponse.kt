package dev.krud.boost.daemon.actuator.model

import org.springframework.boot.logging.LogLevel

data class LoggersActuatorResponse(
    val levels: List<LogLevel>,
    val loggers: Map<String, Logger>,
    val groups: Map<String, Group>
) {
    data class Logger(
        val effectiveLevel: LogLevel,
        val configuredLevel: LogLevel?
    )

    data class Group(
        val configuredLevel: LogLevel?,
        val members: List<String>
    )
}