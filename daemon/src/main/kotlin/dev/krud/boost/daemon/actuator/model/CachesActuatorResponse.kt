package dev.krud.boost.daemon.actuator.model

data class CachesActuatorResponse(
    val cacheManagers: Map<String, CacheManager>
)  {
    data class CacheManager(
        val caches: Map<String, Cache>
    ) {
        data class Cache(
            val target: String
        )
    }
}