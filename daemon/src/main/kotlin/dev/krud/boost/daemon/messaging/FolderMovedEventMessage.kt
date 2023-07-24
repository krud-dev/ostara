package dev.krud.boost.daemon.messaging

import java.util.*

class FolderMovedEventMessage(payload: Payload) : AbstractMessage<FolderMovedEventMessage.Payload>(payload) {
    data class Payload(
        val folderId: UUID,
        val oldParentFolderId: UUID?,
        val newParentFolderId: UUID?,
        val newSort: Double?
    )
}