package dev.krud.boost.daemon.configuration.instance.metric

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class InstanceMetricService(
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceService: InstanceService
) {
    fun getLatestMetric(instanceId: UUID, metricName: String): InstanceMetricRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceService.hasAbilityOrThrow(instance, InstanceAbility.METRICS)
        val response = actuatorClientProvider.doWith(instance) { client ->
            val parsedMetricName = parseMetricName(metricName)
            client.metric(parsedMetricName.name).measurements
                .filter { it.statistic == parsedMetricName.statistic }
                .maxOfOrNull { it.value } ?: throwNotFound("Metric not found: $parsedMetricName")
        }
        return InstanceMetricRO(
            name = metricName,
            description = null,
            unit = null,
            values = listOf(
                InstanceMetricValueRO(
                    value = response,
                    timestamp = LocalDateTime.now()
                )
            )
        )
    }

    private fun parseMetricName(metricName: String): ParsedMetricName {
        val match = METRIC_NAME_REGEX.matchEntire(metricName) ?: throwBadRequest("Invalid metric name: $metricName")
        return ParsedMetricName(match.groupValues[1], match.groupValues[2])
    }

    private data class ParsedMetricName(
        val name: String,
        val statistic: String
    ) {
        override fun toString(): String {
            return "$name[$statistic]"
        }
    }

    companion object {
        private val METRIC_NAME_REGEX = Regex("(.*)\\[(.*)\\]")
    }
}