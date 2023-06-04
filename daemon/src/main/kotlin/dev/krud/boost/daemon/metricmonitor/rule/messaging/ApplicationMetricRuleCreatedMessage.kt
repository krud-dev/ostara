package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationMetricRuleCreatedMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleCreatedMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID,
        val enabled: Boolean,
    )
}