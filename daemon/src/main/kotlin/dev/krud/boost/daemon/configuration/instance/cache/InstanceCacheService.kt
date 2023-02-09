package dev.krud.boost.daemon.configuration.instance.cache

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO.Companion.toRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO.Companion.toROs
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceCacheService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {
    fun getCaches(instanceId: UUID): List<InstanceCacheRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) {
            it.caches()
        }.toROs()
    }

    fun getCache(instanceId: UUID, cacheName: String): InstanceCacheRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) {
            it.cache(cacheName)
        }.toRO()
    }

    fun evictCache(instanceId: UUID, cacheName: String) {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        actuatorClientProvider.doWith(instance) {
            it.evictCache(cacheName)
        }
    }

    fun evictAllCaches(instanceId: UUID) {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        actuatorClientProvider.doWith(instance) {
            it.evictAllCaches()
        }
    }
}