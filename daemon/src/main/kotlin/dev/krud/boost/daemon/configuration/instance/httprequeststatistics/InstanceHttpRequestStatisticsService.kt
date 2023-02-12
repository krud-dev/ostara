package dev.krud.boost.daemon.configuration.instance.httprequeststatistics

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.ro.InstanceHttpRequestStatisticsRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import org.springframework.beans.factory.DisposableBean
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.HttpMethod
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.Executors

@Service
class InstanceHttpRequestStatisticsService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val cacheManager: CacheManager
) : DisposableBean {
    private val httpRequestStatisticsCache = cacheManager.getCache("httpRequestStatisticsCache")!!
    private val executor = Executors.newCachedThreadPool()

    override fun destroy() {
        executor.shutdown()
    }

    @Cacheable(cacheNames = ["httpRequestStatistics"], key = "'all_uris_' + #instanceId")
    fun getStatistics(instanceId: UUID): List<InstanceHttpRequestStatisticsRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
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

    @Cacheable(cacheNames = ["httpRequestStatistics"], key = "'by_uri_and_method_' + #instanceId")
    fun getStatisticsByUriAndMethod(instanceId: UUID, uri: String): Map<HttpMethod, InstanceHttpRequestStatisticsRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val metric = client.metric(METRIC_NAME, mapOf("uri" to uri))
        val availableMethods = metric
            .availableTags
            .find { it.tag == "method" }
            ?.values ?: emptyList()
        val futures = availableMethods.map { method ->
            executor.submit<Pair<HttpMethod, InstanceHttpRequestStatisticsRO>> {
                HttpMethod.valueOf(method) to client.getStatisticsForUri(uri, mapOf("method" to method))
            }
        }
        return futures.associate { it.get() }
    }

    @Cacheable(cacheNames = ["httpRequestStatistics"], key = "'by_uri_and_outcome_' + #instanceId")
    fun getStatisticsByUriAndOutcome(instanceId: UUID, uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val metric = client.metric(METRIC_NAME, mapOf("uri" to uri))
        val availableOutcomes = metric
            .availableTags
            .find { it.tag == "outcome" }
            ?.values ?: emptyList()
        val futures = availableOutcomes.map { outcome ->
            executor.submit<Pair<String, InstanceHttpRequestStatisticsRO>> {
                outcome to client.getStatisticsForUri(uri, mapOf("outcome" to outcome))
            }
        }
        return futures.associate { it.get() }
    }

    @Cacheable(cacheNames = ["httpRequestStatistics"], key = "'by_uri_and_status_' + #instanceId")
    fun getStatisticsByUriAndStatus(instanceId: UUID, uri: String): Map<Int, InstanceHttpRequestStatisticsRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val metric = client.metric(METRIC_NAME, mapOf("uri" to uri))
        val availableStatuses = metric
            .availableTags
            .find { it.tag == "status" }
            ?.values ?: emptyList()
        val futures = availableStatuses.map { status ->
            executor.submit<Pair<Int, InstanceHttpRequestStatisticsRO>> {
                status.toInt() to client.getStatisticsForUri(uri, mapOf("status" to status))
            }
        }
        return futures.associate { it.get() }
    }

    @Cacheable(cacheNames = ["httpRequestStatistics"], key = "'by_uri_and_exception_' + #instanceId")
    fun getStatisticsByUriAndException(instanceId: UUID, uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.HTTP_REQUEST_STATISTICS)
        val client = actuatorClientProvider.provide(instance)
        val metric = client.metric(METRIC_NAME, mapOf("uri" to uri))
        val availableExceptions = metric
            .availableTags
            .find { it.tag == "exception" }
            ?.values ?: emptyList()
        val futures = availableExceptions.map { exception ->
            executor.submit<Pair<String, InstanceHttpRequestStatisticsRO>> {
                exception to client.getStatisticsForUri(uri, mapOf("exception" to exception))
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
            .availableTags
            .find { it.tag == "uri" }
            ?.values ?: emptyList()
    }

    private fun ActuatorHttpClient.getStatisticsForUri(uri: String, tags: Map<String, String> = emptyMap()): InstanceHttpRequestStatisticsRO {
        val metricResponse = this.metric(METRIC_NAME, mapOf("uri" to uri))
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
    }
}