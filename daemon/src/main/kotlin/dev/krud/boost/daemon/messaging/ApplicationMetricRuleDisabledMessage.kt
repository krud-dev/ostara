package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationMetricRuleDisabledMessage(payload: Payload) : AbstractMessage<ApplicationMetricRuleDisabledMessage.Payload>(payload) {
    data class Payload(
        val applicationMetricRuleId: UUID,
        val applicationId: UUID
    )
}