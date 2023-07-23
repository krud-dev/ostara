package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class InstanceCreatedEventMessage(payload: Payload) : AbstractMessage<InstanceCreatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        "/topic/instanceCreation",
        payload.instanceId.toString()
    )
) {
    data class Payload(
        val instanceId: UUID,
        val parentApplicationId: UUID,
        val discovered: Boolean
    )
}