package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class ApplicationHealthUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationHealthUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.APPLICATION_HEALTH,
        payload.applicationId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val applicationId: UUID,
        val newHealth: ApplicationHealthRO
    )
}