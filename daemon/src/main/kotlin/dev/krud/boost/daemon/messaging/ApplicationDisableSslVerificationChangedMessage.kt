package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationDisableSslVerificationChangedMessage(payload: Payload) : AbstractMessage<ApplicationDisableSslVerificationChangedMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val oldValue: Boolean,
        val newValue: Boolean
    )
}