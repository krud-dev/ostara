package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationMovedEventMessage(payload: Payload) : AbstractMessage<ApplicationMovedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val oldParentFolderId: UUID?,
        val newParentFolderId: UUID?,
        val newSort: Double?
    )
}