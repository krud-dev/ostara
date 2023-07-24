package dev.krud.boost.daemon.messaging

import java.util.*

class InstanceHeapdumpDownloadRequestMessage(
    payload: Payload
) : AbstractMessage<InstanceHeapdumpDownloadRequestMessage.Payload>(payload) {
    data class Payload(
        val referenceId: UUID,
        val instanceId: UUID
    )
}