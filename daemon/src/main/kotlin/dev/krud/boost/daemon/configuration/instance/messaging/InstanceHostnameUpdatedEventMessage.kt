package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class InstanceHostnameUpdatedEventMessage(payload: Payload) : AbstractMessage<InstanceHostnameUpdatedEventMessage.Payload>(payload) {
    data class Payload(
        val instanceId: UUID,
        val hostname: String?
    )
}