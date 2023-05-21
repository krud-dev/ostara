package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

class ApplicationMetricRuleMetricModifiedMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleMetricModifiedMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID,
        val newMetricName: String,
        val oldMetricName: String
    )
}