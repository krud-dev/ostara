package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class InstanceHealthChangedEventMessage(payload: Payload) : AbstractMessage<InstanceHealthChangedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.INSTANCE_HEALTH,
        payload.instanceId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val parentApplicationId: UUID,
        val instanceId: UUID,
        val oldHealth: InstanceHealthRO,
        val newHealth: InstanceHealthRO
    )
}