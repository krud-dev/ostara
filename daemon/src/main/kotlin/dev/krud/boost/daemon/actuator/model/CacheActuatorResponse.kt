package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class CacheActuatorResponse(
    val target: String = TypeDefaults.STRING,
    val name: String = TypeDefaults.STRING,
    val cacheManager: String = TypeDefaults.STRING
)