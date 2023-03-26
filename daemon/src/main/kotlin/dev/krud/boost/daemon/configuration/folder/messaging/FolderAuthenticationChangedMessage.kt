package dev.krud.boost.daemon.configuration.folder.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class FolderAuthenticationChangedMessage(payload: Payload) : AbstractMessage<FolderAuthenticationChangedMessage.Payload>(payload) {
    data class Payload(
        val folderId: UUID
    )
}