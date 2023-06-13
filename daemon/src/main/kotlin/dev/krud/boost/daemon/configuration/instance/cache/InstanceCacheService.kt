package dev.krud.boost.daemon.configuration.instance.cache

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.cache.ro.EvictCachesRequestRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO.Companion.toRO
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheRO.Companion.toROs
import dev.krud.boost.daemon.configuration.instance.cache.ro.InstanceCacheStatisticsRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.boost.daemon.utils.ResultAggregationSummary.Companion.aggregate
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.DisposableBean
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.Executors

@Service
class InstanceCacheService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityService: InstanceAbilityService
) : DisposableBean {
    // TODO: replace with a lighter solution
    private val executorService = Executors.newFixedThreadPool(8)

    fun getCaches(instanceId: UUID): List<InstanceCacheRO> {
        log.debug { "Getting caches for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) { client ->
            client.caches()
                .fold(
                    { it.toROs() },
                    { emptyList() }
                )
        }
            .apply {
                log.trace { "Instance $instanceId has caches '${this.joinToString { it.name }}'" }
            }
    }

    fun getCache(instanceId: UUID, cacheName: String): InstanceCacheRO {
        log.debug { "Getting cache $cacheName for instance $instanceId" }
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) {
            it.cache(cacheName).getOrThrow()
        }.toRO()
    }

    fun evictCache(instanceId: UUID, cacheName: String): Result<Unit> {
        log.debug { "Evicting cache $cacheName for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) {
            it.evictCache(cacheName)
        }
    }

    fun evictAllCaches(instanceId: UUID): Result<Unit> {
        log.debug { "Evicting all caches for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        return actuatorClientProvider.doWith(instance) {
            it.evictAllCaches()
        }
    }

    fun getCacheStatistics(instanceId: UUID, cacheName: String): InstanceCacheStatisticsRO {
        log.debug { "Getting cache statistics for cache $cacheName of instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES, InstanceAbility.CACHE_STATISTICS)
        return actuatorClientProvider.doWith(instance) {
            val metrics = STATS_METRIC_NAMES.associateWith { metricName ->
                try {
                    it.metric(metricName, mapOf("cache" to cacheName))
                        .getOrThrow()
                        .measurements.firstOrNull()?.value?.toLong()
                        ?: -1L
                } catch (e: Exception) {
                    -1L
                }
            }
                .toInstanceCacheStatistics()
            metrics
        }
    }

    fun evictCaches(instanceId: UUID, request: EvictCachesRequestRO): ResultAggregationSummary<Unit> {
        log.debug { "Evicting caches ${request.cacheNames.joinToString()} for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.CACHES)
        val results = request.cacheNames.map { cacheName ->
            executorService.submit<Result<Unit>> {
                evictCache(instanceId, cacheName)
            }
        }
            .map { it.get() }
        return results.aggregate()
    }

    override fun destroy() {
        executorService.shutdown()
    }

    companion object {
        private val log = KotlinLogging.logger { }
        private val STATS_METRIC_NAMES = setOf(
            "cache.gets",
            "cache.puts",
            "cache.evictions",
            "cache.hits",
            "cache.misses",
            "cache.removals",
            "cache.size"
        )

        private fun Map<String, Long>.toInstanceCacheStatistics(): InstanceCacheStatisticsRO {
            return InstanceCacheStatisticsRO(
                gets = this["cache.gets"] ?: -1,
                puts = this["cache.puts"] ?: -1,
                evictions = this["cache.evictions"] ?: -1,
                hits = this["cache.hits"] ?: -1,
                misses = this["cache.misses"] ?: -1,
                removals = this["cache.removals"] ?: -1,
                size = this["cache.size"] ?: -1
            )
        }
    }
}