package dev.krud.boost.daemon.configuration.application.cache

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.cache.ro.ApplicationCacheRO
import dev.krud.boost.daemon.configuration.application.cache.ro.ApplicationCacheStatisticsRO
import dev.krud.boost.daemon.configuration.instance.cache.InstanceCacheService
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheStatisticsRO.Companion.toApplicationRO
import org.springframework.stereotype.Service
import java.util.*

// TODO: map errors in foreach, return success/fails
@Service
class ApplicationCacheService(
    private val applicationService: ApplicationService,
    private val instanceCacheService: InstanceCacheService
) {
    fun getCaches(applicationId: UUID): List<ApplicationCacheRO> {
        val application = applicationService.getApplicationOrThrow(applicationId)
        // TODO: check app ability
        return application.instances.flatMap { instance ->
            try {
                instanceCacheService.getCaches(instance.id)
            } catch (e: Exception) {
                emptyList()
            }
        }
            .toSet()
            .map {
                ApplicationCacheRO(
                    name = it.name,
                    cacheManager = it.cacheManager,
                    target = it.target
                )
            }
    }

    fun getCache(applicationId: UUID, cacheName: String): ApplicationCacheRO {
        val application = applicationService.getApplicationOrThrow(applicationId)
        // TODO: check app ability
        val instanceCacheSample = application.instances.mapNotNull { instance ->
            try {
                instanceCacheService.getCache(instance.id, cacheName)
            } catch (e: Exception) {
                null
            }
        }
            .first()
        return ApplicationCacheRO(
            name = instanceCacheSample.name,
            cacheManager = instanceCacheSample.cacheManager,
            target = instanceCacheSample.target
        )
    }

    fun evictAllCaches(applicationId: UUID) {
        val application = applicationService.getApplicationOrThrow(applicationId)
        // TODO: check app ability
        application.instances.forEach { instance ->
            try {
                instanceCacheService.evictAllCaches(instance.id)
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    fun evictCache(applicationId: UUID, cacheName: String) {
        val application = applicationService.getApplicationOrThrow(applicationId)
        // TODO: check app ability
        application.instances.forEach { instance ->
            try {
                instanceCacheService.evictCache(instance.id, cacheName)
            } catch (e: Exception) {
                // ignore
            }
        }
    }

    fun getCacheStatistics(applicationId: UUID, cacheName: String): ApplicationCacheStatisticsRO {
        val application = applicationService.getApplicationOrThrow(applicationId)
        // TODO: check app ability
        return application.instances.mapNotNull { instance ->
            try {
                instanceCacheService.getCacheStatistics(instance.id, cacheName)
            } catch (e: Exception) {
                null
            }
        }.toApplicationRO()
    }
}