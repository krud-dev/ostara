package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class ApplicationUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        "/topic/applicationUpdate",
        payload.applicationId.toString()
    )
) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}