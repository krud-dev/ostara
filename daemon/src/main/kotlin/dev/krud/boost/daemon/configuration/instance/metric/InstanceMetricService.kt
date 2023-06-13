package dev.krud.boost.daemon.configuration.instance.metric

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.ParsedMetricName
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceMetricService(
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceService: InstanceService,
    private val instanceAbilityService: InstanceAbilityService
) {
    fun getLatestMetric(instanceId: UUID, metricName: ParsedMetricName): InstanceMetricRO {
        log.debug { "Get latest metric for instance $instanceId and metric name $metricName" }
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.METRICS)
        val response = actuatorClientProvider.doWith(instance) { client ->
            client.metric(metricName.name)
                .getOrThrow()
                .measurements
                .filter { it.statistic == metricName.statistic }
                .maxOfOrNull { it.value } ?: throwNotFound("Metric not found: $metricName")
        }
        return InstanceMetricRO(
            name = metricName.toString(),
            description = null,
            unit = null,
            value = InstanceMetricValueRO(
                value = response,
                timestamp = Date()
            )
        )
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}