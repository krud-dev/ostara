package dev.krud.boost.daemon.configuration.application.logger.ro

import dev.krud.boost.daemon.configuration.instance.logger.ro.InstanceLoggerRO
import java.util.*

data class ApplicationLoggerRO(
    val name: String,
    val loggers: MutableMap<UUID, InstanceLoggerRO>
)