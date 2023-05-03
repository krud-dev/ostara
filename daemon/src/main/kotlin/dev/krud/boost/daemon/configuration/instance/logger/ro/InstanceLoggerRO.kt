package dev.krud.boost.daemon.configuration.instance.logger.ro

data class InstanceLoggerRO(
    val name: String,
    val effectiveLevel: String?,
    val configuredLevel: String?
)