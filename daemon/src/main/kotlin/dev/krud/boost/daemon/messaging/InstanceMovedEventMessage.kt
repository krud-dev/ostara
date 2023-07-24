package dev.krud.boost.daemon.messaging

import java.util.*

class InstanceMovedEventMessage(payload: Payload) : AbstractMessage<InstanceMovedEventMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID,
        val oldParentApplicationId: UUID,
        val newParentApplicationId: UUID,
        val newSort: Double?
    )
}