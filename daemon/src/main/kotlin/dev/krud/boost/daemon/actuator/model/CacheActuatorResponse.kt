package dev.krud.boost.daemon.actuator.model

data class CacheActuatorResponse(
    val target: String,
    val name: String,
    val cacheManager: String
)