package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationMetricRuleEnabledMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleEnabledMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID
    )
}