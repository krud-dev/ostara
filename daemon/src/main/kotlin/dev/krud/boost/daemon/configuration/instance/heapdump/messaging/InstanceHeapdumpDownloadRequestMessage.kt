package dev.krud.boost.daemon.configuration.instance.heapdump.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class InstanceHeapdumpDownloadRequestMessage(
    payload: Payload
) : AbstractMessage<InstanceHeapdumpDownloadRequestMessage.Payload>(payload) {
    data class Payload(
        val referenceId: UUID,
        val instanceId: UUID
    )
}