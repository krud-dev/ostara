package dev.krud.boost.daemon.utils

import dev.krud.boost.daemon.actuator.model.MetricActuatorResponse
import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
import dev.krud.boost.daemon.exception.throwBadRequest
import java.util.*

@GenerateTypescript
data class ParsedMetricName(
    val name: String,
    val statistic: String,
    val tags: Map<String, String> = emptyMap()
) {
    override fun toString(): String {
        return "$name[$statistic]${
            if (tags.isEmpty()) {
                ""
            } else {
                "?${tags.map { "${it.key}=${it.value}" }.joinToString("&")}"
            }
        }"
    }

    companion object {
        val METRIC_NAME_REGEX = Regex("(.*)\\[(.*)\\](.*)")
        fun from(name: String): ParsedMetricName {
            val match = METRIC_NAME_REGEX.matchEntire(name) ?: throwBadRequest("Invalid metric name: $name")
            if (!match.groupValues.getOrNull(3).isNullOrBlank()) {
                val rawTags = match.groupValues[3]
                if (!rawTags.startsWith("?")) {
                    throwBadRequest("Invalid metric name: $name")
                }
                val tags = rawTags.substring(1).split("&").associate {
                    val tag = it.split("=")
                    tag[0] to tag[1]
                }
                return ParsedMetricName(match.groupValues[1], match.groupValues[2], tags)
            }
            return ParsedMetricName(match.groupValues[1], match.groupValues[2], emptyMap())
        }

        fun MetricActuatorResponse.getRo(parsedMetricName: ParsedMetricName): InstanceMetricRO? {
            if (parsedMetricName.name != name) {
                return null
            }
            val measurement = measurements
                .firstOrNull { it.statistic == parsedMetricName.statistic }
                ?.value ?: return null
            return InstanceMetricRO(
                name = parsedMetricName.toString(),
                description = description,
                unit = baseUnit,
                value = InstanceMetricValueRO(
                    value = measurement,
                    timestamp = Date()
                )
            )
        }

    }
}