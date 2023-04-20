package dev.krud.boost.daemon.configuration.instance.httprequeststatistics

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.enums.HttpMethod
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.ro.InstanceHttpRequestStatisticsRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import io.github.oshai.KotlinLogging
import org.springframework.beans.factory.DisposableBean
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.Executors

@Service
class InstanceHttpRequestStatisticsService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityService: InstanceAbilityService,
    cacheManager: CacheManager
) : DisposableBean {
    private val httpRequestStatisticsCache by cacheManager.resolve()
    private val executor = Executors.newCachedThreadPool()

    override fun destroy() {
        executor.shutdown()
    }

    @Cacheable(cacheNames = ["httpRequestStatisticsCache"], key = "'all_uris_' + #instanceId")
    fun getStatistics(instanceId: UUID): List<InstanceHttpRequestStatisticsRO> {
        log.debug { "Get Http Request Statistics for instance $instanceId" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val availableUris = client.getAvailableUris()
        if (availableUris.isEmpty()) {
            return emptyList()
        }
        val futures = availableUris.map { uri ->
            executor.submit<InstanceHttpRequestStatisticsRO> {
                client.getStatisticsForUri(uri)
            }
        }
        return futures.map { it.get() }
    }

    @Cacheable(cacheNames = ["httpRequestStatisticsCache"], key = "'by_uri_and_method_' + #instanceId + '_' + #uri")
    fun getStatisticsByUriAndMethod(instanceId: UUID, uri: String): Map<HttpMethod, InstanceHttpRequestStatisticsRO> {
        return getStatisticsByTag(instanceId, uri, "method") { availableTagValue -> HttpMethod.valueOf(availableTagValue) }
    }

    @Cacheable(cacheNames = ["httpRequestStatisticsCache"], key = "'by_uri_and_outcome_' + #instanceId + '_' + #uri")
    fun getStatisticsByUriAndOutcome(instanceId: UUID, uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return getStatisticsByTag(instanceId, uri, "outcome") { availableTagValue -> availableTagValue }
    }

    @Cacheable(cacheNames = ["httpRequestStatisticsCache"], key = "'by_uri_and_status_' + #instanceId + '_' + #uri")
    fun getStatisticsByUriAndStatus(instanceId: UUID, uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return getStatisticsByTag(instanceId, uri, "status") { availableTagValue -> availableTagValue }
    }

    @Cacheable(cacheNames = ["httpRequestStatisticsCache"], key = "'by_uri_and_exception_' + #instanceId + '_' + #uri")
    fun getStatisticsByUriAndException(instanceId: UUID, uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return getStatisticsByTag(instanceId, uri, "exception") { availableTagValue -> availableTagValue }
    }

    private fun <KeyType : Any> getStatisticsByTag(instanceId: UUID, uri: String, tag: String, keySupplier: (String) -> KeyType): Map<KeyType, InstanceHttpRequestStatisticsRO> {
        log.debug { "Get Http Request Statistics grouped by uri and tag $tag for instance $instanceId and uri $uri" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val metric = client.metric(METRIC_NAME, mapOf("uri" to uri))
        val availableTagValues = metric
            .getOrThrow()
            .availableTags
            .find { it.tag == tag }
            ?.values ?: emptyList()
        val futures = availableTagValues.map { availableTagValue ->
            executor.submit<Pair<KeyType, InstanceHttpRequestStatisticsRO>> {
                keySupplier(availableTagValue) to client.getStatisticsForUri(uri, mapOf(tag to availableTagValue))
            }
        }
        return futures.associate { it.get() }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                getCacheKeys(event.payload.instanceId).forEach {
                    httpRequestStatisticsCache.evict(it)
                }
            }
            is InstanceUpdatedEventMessage -> {
                getCacheKeys(event.payload.instanceId).forEach {
                    httpRequestStatisticsCache.evict(it)
                }
            }
            is InstanceDeletedEventMessage -> {
                getCacheKeys(event.payload.instanceId).forEach {
                    httpRequestStatisticsCache.evict(it)
                }
            }
        }
    }

    private fun ActuatorHttpClient.getAvailableUris(): List<String> {
        val metric = metric(METRIC_NAME)
        return metric
            .getOrThrow()
            .availableTags
            .find { it.tag == "uri" }
            ?.values ?: emptyList()
    }

    private fun ActuatorHttpClient.getStatisticsForUri(uri: String, tags: Map<String, String> = emptyMap()): InstanceHttpRequestStatisticsRO {
        log.debug { "Get http statistics for uri $uri" }
        val metricResponse = this.metric(METRIC_NAME, mapOf("uri" to uri) + tags)
            .getOrThrow()
        val count = metricResponse.measurements.find { it.statistic == "COUNT" }?.value ?: -1.0
        val max = metricResponse.measurements.find { it.statistic == "MAX" }?.value ?: -1.0
        val totalTime = metricResponse.measurements.find { it.statistic == "TOTAL_TIME" }?.value ?: -1.0
        return InstanceHttpRequestStatisticsRO(
            uri = uri,
            count = count.toLong(),
            max = max.toLong(),
            totalTime = totalTime.toLong()
        )
    }

    companion object {
        private const val METRIC_NAME = "http.server.requests"
        private fun getCacheKeys(instanceId: UUID): Set<String> {
            return setOf(
                "all_uris_$instanceId",
                "by_uri_and_method_$instanceId",
                "by_uri_and_outcome_$instanceId",
                "by_uri_and_status_$instanceId",
                "by_uri_and_exception_$instanceId"
            )
        }
        private val log = KotlinLogging.logger { }
    }
}