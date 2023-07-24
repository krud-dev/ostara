package dev.krud.boost.daemon.messaging

import java.util.*

class InstanceMetadataRefreshRequestMessage(payload: Payload) : AbstractMessage<InstanceMetadataRefreshRequestMessage.Payload>(
    payload
) {
    data class Payload(
        val instanceId: UUID
    )
}