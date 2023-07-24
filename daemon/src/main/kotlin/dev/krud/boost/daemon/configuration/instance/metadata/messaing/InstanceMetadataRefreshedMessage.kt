package dev.krud.boost.daemon.configuration.instance.metadata.messaing

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

class InstanceMetadataRefreshedMessage(payload: Payload) : AbstractMessage<InstanceMetadataRefreshedMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.INSTANCE_METADATA,
        payload.instanceId.toString()
    )
) {
    @GenerateTypescript
    data class Payload(
        val instanceId: UUID,
        val metadata: InstanceMetadataDTO
    )
}