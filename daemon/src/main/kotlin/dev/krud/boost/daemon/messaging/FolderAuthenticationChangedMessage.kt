package dev.krud.boost.daemon.messaging

import java.util.*

class FolderAuthenticationChangedMessage(payload: Payload) : AbstractMessage<FolderAuthenticationChangedMessage.Payload>(payload) {
    data class Payload(
        val folderId: UUID
    )
}