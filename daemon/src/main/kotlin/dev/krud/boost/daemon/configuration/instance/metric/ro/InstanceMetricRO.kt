package dev.krud.boost.daemon.configuration.instance.metric.ro

import java.util.*

data class InstanceMetricRO(
    val name: String,
    val description: String?,
    val unit: String?,
    val value: InstanceMetricValueRO
) {
    companion object {
        fun from(name: String, value: Double, timestamp: Date = Date(), description: String? = null, unit: String? = null): InstanceMetricRO {
            return InstanceMetricRO(
                name = name,
                description = description,
                unit = unit,
                value = InstanceMetricValueRO(
                    value = value,
                    timestamp = timestamp
                )
            )
        }
    }
}

data class InstanceMetricValueRO(
    val value: Double,
    val timestamp: Date
)