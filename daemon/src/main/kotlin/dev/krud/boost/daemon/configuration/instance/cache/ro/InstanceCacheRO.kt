package dev.krud.boost.daemon.configuration.instance.cache.ro

import dev.krud.boost.daemon.actuator.model.CacheActuatorResponse
import dev.krud.boost.daemon.actuator.model.CachesActuatorResponse

data class InstanceCacheRO(
    val name: String,
    val cacheManager: String,
    val target: String
) {
    companion object {
        fun CacheActuatorResponse.toRO(): InstanceCacheRO {
            return InstanceCacheRO(
                name = name,
                cacheManager = cacheManager,
                target = target
            )
        }

        fun CachesActuatorResponse.toROs(): List<InstanceCacheRO> {
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