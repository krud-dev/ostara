package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class InstanceDeletedEventMessage(payload: Payload) : AbstractMessage<InstanceDeletedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.INSTANCE_DELETION,
        payload.instanceId.toString()
    )
) {
    data class Payload(
        val instanceId: UUID,
        val parentApplicationId: UUID,
        val discovered: Boolean
    )
}