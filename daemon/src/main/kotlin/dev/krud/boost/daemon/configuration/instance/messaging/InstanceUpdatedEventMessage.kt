package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class InstanceUpdatedEventMessage(payload: Payload) : AbstractMessage<InstanceUpdatedEventMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID
    )
}