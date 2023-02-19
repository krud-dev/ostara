package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationUpdatedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID
    )
}