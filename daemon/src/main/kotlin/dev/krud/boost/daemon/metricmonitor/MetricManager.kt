package dev.krud.boost.daemon.metricmonitor

import dev.krud.boost.daemon.actuator.model.MetricActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.metricmonitor.messaging.InstanceMetricUpdatedMessage
import dev.krud.boost.daemon.utils.ParsedMetricName
import dev.krud.boost.daemon.utils.ParsedMetricName.Companion.getRo
import dev.krud.boost.daemon.utils.newLimitedCachedThreadPool
import io.micrometer.core.instrument.Counter
import io.micrometer.core.instrument.Gauge
import io.micrometer.core.instrument.MeterRegistry
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*
import kotlin.jvm.optionals.getOrNull

@Service
class MetricManager(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceMetricUpdatedChannel: PublishSubscribeChannel,
    private val meterRegistry: MeterRegistry
) {
    private val metricRequestsByInstance = mutableMapOf<UUID, Set<MetricRequest>>()
    private val lastMetricData = mutableMapOf<Pair<UUID, ParsedMetricName>, Optional<InstanceMetricRO>>()
    private val mutex = Mutex()
    private val dispatcher = newLimitedCachedThreadPool(8).asCoroutineDispatcher()

    fun getInstanceRequests(instanceId: UUID): Set<MetricRequest> {
        return metricRequestsByInstance[instanceId] ?: emptySet()
    }

    fun requestMetric(instanceId: UUID, metricName: ParsedMetricName) = runBlocking {
        mutex.withLock {
            val metricRequest = MetricRequest(metricName)
            metricRequestsByInstance.compute(instanceId) { _, metricRequests ->
                metricRequests?.plus(metricRequest) ?: setOf(metricRequest)
            }?.let { metricRequests ->
                metricRequests.find { it.metricName == metricName }?.inc()
                Counter.builder("ostara.metric.requests")
                    .tag("instanceId", instanceId.toString())
                    .tag("metricName", metricName.toString())
                    .register(meterRegistry)
                    .increment(1.0)
            }
        }
    }

    fun releaseMetric(instanceId: UUID, metricName: ParsedMetricName) = runBlocking {
        mutex.withLock {
            val metricRequest = metricRequestsByInstance[instanceId]?.find { it.metricName == metricName }
            metricRequest?.let { request ->
                request.dec()
                Counter.builder("ostara.metric.requests")
                    .tag("instanceId", instanceId.toString())
                    .tag("metricName", metricName.toString())
                    .register(meterRegistry)
                    .increment(-1.0)
            }
            if (metricRequest?.requesterCount?.get() == 0) {
                metricRequestsByInstance.compute(instanceId) { _, metricRequests ->
                    metricRequests?.minus(metricRequest) ?: emptySet()
                }
            }

            if (metricRequestsByInstance[instanceId]?.isEmpty() == true) {
                metricRequestsByInstance.remove(instanceId)
            }
        }
    }

    fun releaseAllMetrics(instanceId: UUID) = runBlocking {
        mutex.withLock {
            metricRequestsByInstance.remove(instanceId)
        }
    }

    fun getLatestMetric(instanceId: UUID, metricName: ParsedMetricName): InstanceMetricRO? {
        return lastMetricData[instanceId to metricName]?.getOrNull()
    }

    @Scheduled(fixedDelay = 10000)
    fun fetchMetrics() = runBlocking {
        mutex.withLock {
            val instancesToRemove = mutableSetOf<UUID>()
            metricRequestsByInstance.forEach { (instanceId, metricRequests) ->
                launch(dispatcher) {
                    val instance = instanceService.getInstanceFromCache(instanceId)
                    if (instance != null) {
                        val client = actuatorClientProvider.provide(instance)
                        val metricRequestsGrouped = metricRequests.groupBy { it.metricName.name to it.metricName.tags }
                        metricRequestsGrouped.forEach { (idPair, metricRequests) ->
                            val (name, tags) = idPair
                            val response = client.metric(name, tags)
                                .getOrNull()
                            metricRequests.forEach { metricRequest ->
                                updateMetricValues(instance, metricRequest, response)
                            }
                        }
                    } else {
                        instancesToRemove += instanceId
                    }
                }
            }

            for (uuid in instancesToRemove) {
                metricRequestsByInstance.remove(uuid)
                lastMetricData.keys.removeIf { it.first == uuid }
            }
        }
    }

    private fun updateMetricValues(
        instance: Instance,
        metricRequest: MetricRequest,
        response: MetricActuatorResponse?
    ) {
        val lastMetricValue = lastMetricData[instance.id to metricRequest.metricName]
        val newMetricValue = response?.getRo(metricRequest.metricName)?.let {
            Optional.of(it)
        } ?: Optional.empty()
        lastMetricData[instance.id to metricRequest.metricName] = newMetricValue
            if (lastMetricValue != null && lastMetricValue.getOrNull()?.value?.value != newMetricValue.getOrNull()?.value?.value) {
                instanceMetricUpdatedChannel.send(
                    InstanceMetricUpdatedMessage(
                        InstanceMetricUpdatedMessage.Payload(
                            instance.id,
                            instance.parentApplicationId,
                            metricRequest.metricName,
                            lastMetricValue.getOrNull(),
                            newMetricValue.getOrNull()
                        )
                    )
                )
            }
    }
}

