package dev.krud.boost.daemon.configuration.instance.metadata.messaing

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class InstanceMetadataRefreshRequestMessage(payload: Payload) : AbstractMessage<InstanceMetadataRefreshRequestMessage.Payload>(
    payload
) {
    data class Payload(
        val instanceId: UUID
    )
}