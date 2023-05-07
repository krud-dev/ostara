package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class LoggersActuatorResponse(
    val levels: List<String> = emptyList(),
    val loggers: Map<String, Logger> = emptyMap(),
    val groups: Map<String, Group> = emptyMap()
) {
    data class Logger(
        val effectiveLevel: String = TypeDefaults.STRING,
        val configuredLevel: String? = null
    )

    data class Group(
        val configuredLevel: String? = TypeDefaults.STRING,
        val members: List<String> = emptyList()
    )
}