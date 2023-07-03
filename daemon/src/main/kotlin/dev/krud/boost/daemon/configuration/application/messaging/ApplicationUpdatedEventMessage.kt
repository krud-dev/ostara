package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

@GenerateTypescript
class ApplicationUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationUpdatedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}