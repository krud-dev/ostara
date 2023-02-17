package dev.krud.boost.daemon.actuator.model

import org.springframework.boot.logging.LogLevel

data class LoggersActuatorResponse(
    val levels: List<LogLevel>,
    val loggers: Map<String, Logger>
) {
    data class Logger(
        val effectiveLevel: LogLevel,
        val configuredLevel: LogLevel?
    )
}