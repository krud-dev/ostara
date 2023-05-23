package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationMetricRuleEnabledMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleEnabledMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID
    )
}