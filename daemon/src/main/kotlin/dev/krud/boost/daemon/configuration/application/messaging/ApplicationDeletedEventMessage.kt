package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationDeletedEventMessage(payload: Payload) : AbstractMessage<ApplicationDeletedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID
    )
}