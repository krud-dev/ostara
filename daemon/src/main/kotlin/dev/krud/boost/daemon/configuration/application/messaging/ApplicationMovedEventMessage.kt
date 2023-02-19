package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class ApplicationMovedEventMessage(payload: Payload) : AbstractMessage<ApplicationMovedEventMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID,
        val oldParentFolderId: UUID,
        val newParentFolderId: UUID
    )
}