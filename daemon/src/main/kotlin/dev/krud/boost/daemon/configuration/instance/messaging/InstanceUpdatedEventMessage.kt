package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class InstanceUpdatedEventMessage(payload: Payload) : AbstractMessage<InstanceUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        "/topic/instanceUpdate",
        payload.instanceId.toString()
    )
) {
    data class Payload(
        val instanceId: UUID,
        val parentApplicationId: UUID,
        val discovered: Boolean
    )
}