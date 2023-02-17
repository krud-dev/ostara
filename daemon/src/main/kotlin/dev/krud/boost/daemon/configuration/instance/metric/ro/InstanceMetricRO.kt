package dev.krud.boost.daemon.configuration.instance.metric.ro

import java.util.*

data class InstanceMetricRO(
    val name: String,
    val description: String?,
    val unit: String?,
    val values: List<InstanceMetricValueRO>
)

data class InstanceMetricValueRO(
    val value: Number,
    val timestamp: Date
)