package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class CachesActuatorResponse(
    val cacheManagers: Map<String, CacheManager> = emptyMap()
) {
    data class CacheManager(
        val caches: Map<String, Cache> = emptyMap()
    ) {
        data class Cache(
            val target: String = TypeDefaults.STRING
        )
    }
}