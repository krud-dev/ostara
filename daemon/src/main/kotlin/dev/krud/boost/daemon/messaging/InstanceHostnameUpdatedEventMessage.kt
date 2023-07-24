package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class InstanceHostnameUpdatedEventMessage(payload: Payload) : AbstractMessage<InstanceHostnameUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.INSTANCE_HOSTNAME,
        payload.instanceId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val instanceId: UUID,
        val hostname: String?
    )
}