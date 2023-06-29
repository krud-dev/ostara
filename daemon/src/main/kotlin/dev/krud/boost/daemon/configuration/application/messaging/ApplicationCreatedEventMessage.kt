package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationCreatedEventMessage(payload: Payload) : AbstractMessage<ApplicationCreatedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}