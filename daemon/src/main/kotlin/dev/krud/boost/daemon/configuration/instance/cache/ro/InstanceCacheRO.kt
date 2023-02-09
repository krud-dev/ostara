package dev.krud.boost.daemon.configuration.instance.cache.ro

import dev.krud.boost.daemon.actuator.ActuatorHttpClient

data class InstanceCacheRO(
    val name: String,
    val cacheManager: String,
    val target: String
) {
    companion object {
        fun ActuatorHttpClient.CacheResponse.toRO(): InstanceCacheRO {
            return InstanceCacheRO(
                name = name,
                cacheManager = cacheManager,
                target = target
            )
        }

        fun ActuatorHttpClient.CachesResponse.toROs(): List<InstanceCacheRO> {
            return cacheManagers.flatMap { (cacheManagerName, cacheManager) ->
                cacheManager.caches.map { (cacheName, cache) ->
                    InstanceCacheRO(
                        name = cacheName,
                        cacheManager = cacheManagerName,
                        target = cache.target
                    )
                }
            }
        }
    }
}