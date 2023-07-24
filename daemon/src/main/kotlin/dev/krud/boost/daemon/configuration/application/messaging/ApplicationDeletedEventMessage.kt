package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class ApplicationDeletedEventMessage(payload: Payload) : AbstractMessage<ApplicationDeletedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.APPLICATION_DELETION,
        payload.applicationId.toString()
    )
) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}