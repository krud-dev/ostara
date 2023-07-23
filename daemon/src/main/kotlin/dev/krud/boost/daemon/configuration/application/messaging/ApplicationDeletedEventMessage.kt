package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class ApplicationDeletedEventMessage(payload: Payload) : AbstractMessage<ApplicationDeletedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        "/topic/applicationDeletion",
        payload.applicationId.toString()
    )
) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}