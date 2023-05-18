package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationDisableSslVerificationChangedMessage(payload: Payload) : AbstractMessage<ApplicationDisableSslVerificationChangedMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val oldValue: Boolean,
        val newValue: Boolean
    )
}