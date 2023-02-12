package dev.krud.boost.daemon.configuration.instance.logger.ro

import org.springframework.boot.logging.LogLevel

data class InstanceLoggerRO(
    val name: String,
    val effectiveLevel: LogLevel?,
    val configuredLevel: LogLevel?
)