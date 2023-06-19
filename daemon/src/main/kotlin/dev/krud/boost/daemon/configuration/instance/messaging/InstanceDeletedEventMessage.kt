package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

@GenerateTypescript
class InstanceDeletedEventMessage(payload: Payload) : AbstractMessage<InstanceDeletedEventMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID,
        val parentApplicationId: UUID
    )
}