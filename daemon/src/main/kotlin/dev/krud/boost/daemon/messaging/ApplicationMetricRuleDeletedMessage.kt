package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationMetricRuleDeletedMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleDeletedMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID
    )
}