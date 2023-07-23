package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class InstanceHostnameUpdatedEventMessage(payload: Payload) : AbstractMessage<InstanceHostnameUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        "/topic/instanceHostname",
        payload.instanceId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val instanceId: UUID,
        val hostname: String?
    )
}