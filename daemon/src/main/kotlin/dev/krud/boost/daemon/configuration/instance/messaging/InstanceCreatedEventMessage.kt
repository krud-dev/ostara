package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class InstanceCreatedEventMessage(payload: Payload) : AbstractMessage<InstanceCreatedEventMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID
    )
}