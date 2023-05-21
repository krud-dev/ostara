package dev.krud.boost.daemon.metricmonitor.rule.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationMetricRuleDeletedMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleDeletedMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID
    )
}