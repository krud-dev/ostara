package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.metricmonitor.rule.ro.ApplicationMetricRuleRO
import java.util.*

class InstanceApplicationMetricRuleTriggeredMessage(payload: Payload) : AbstractMessage<InstanceApplicationMetricRuleTriggeredMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRule: ApplicationMetricRuleRO,
        val instanceId: UUID,
        val value: Double,
    )
}