package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.util.*

class InstanceHealthChangedEventMessage(payload: Payload) : AbstractMessage<InstanceHealthChangedEventMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val parentApplicationId: UUID,
        val instanceId: UUID,
        val oldStatus: InstanceHealthStatus,
        val newStatus: InstanceHealthStatus
    )
}