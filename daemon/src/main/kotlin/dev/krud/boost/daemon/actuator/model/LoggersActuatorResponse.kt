package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue
import dev.krud.boost.daemon.jackson.MultiDateParsingModule
import org.springframework.boot.logging.LogLevel

data class LoggersActuatorResponse(
    val levels: List<LogLevel> = emptyList(),
    val loggers: Map<String, Logger> = emptyMap(),
    val groups: Map<String, Group> = emptyMap()
) {
    data class Logger(
        val effectiveLevel: LogLevel = LogLevel.OFF,
        val configuredLevel: LogLevel? = null
    )

    data class Group(
        val configuredLevel: LogLevel? = LogLevel.OFF,
        val members: List<String> = emptyList()
    )
}