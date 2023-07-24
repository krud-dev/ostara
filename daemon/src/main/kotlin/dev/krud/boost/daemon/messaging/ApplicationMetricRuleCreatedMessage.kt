package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationMetricRuleCreatedMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleCreatedMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID,
        val enabled: Boolean,
    )
}