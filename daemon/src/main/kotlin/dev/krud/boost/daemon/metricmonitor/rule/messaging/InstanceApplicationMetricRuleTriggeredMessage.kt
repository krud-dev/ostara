package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

class InstanceApplicationMetricRuleTriggeredMessage(payload: Payload) : AbstractMessage<InstanceApplicationMetricRuleTriggeredMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val operation: ApplicationMetricRuleOperation,
        val applicationId: UUID,
        val instanceId: UUID,
        val metricName: ParsedMetricName,
        val value: Double,
    )
}