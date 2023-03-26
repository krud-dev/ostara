package dev.krud.boost.daemon.configuration.folder.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class FolderMovedEventMessage(payload: Payload) : AbstractMessage<FolderMovedEventMessage.Payload>(payload) {
    data class Payload(
        val folderId: UUID,
        val oldParentFolderId: UUID?,
        val newParentFolderId: UUID?,
        val newSort: Double?
    )
}