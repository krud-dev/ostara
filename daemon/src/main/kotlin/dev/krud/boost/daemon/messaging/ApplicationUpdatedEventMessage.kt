package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class ApplicationUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.APPLICATION_UPDATE,
        payload.applicationId.toString()
    )
) {
    data class Payload(
        val applicationId: UUID,
        val discovered: Boolean
    )
}