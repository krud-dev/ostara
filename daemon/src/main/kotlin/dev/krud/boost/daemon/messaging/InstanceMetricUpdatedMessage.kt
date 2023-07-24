package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

class InstanceMetricUpdatedMessage(payload: Payload) : AbstractMessage<InstanceMetricUpdatedMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID,
        val parentApplicationId: UUID,
        val metricName: ParsedMetricName,
        val oldValue: InstanceMetricRO?,
        val newValue: InstanceMetricRO?
    )
}