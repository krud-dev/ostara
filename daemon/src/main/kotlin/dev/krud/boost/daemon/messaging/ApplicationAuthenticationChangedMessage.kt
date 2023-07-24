package dev.krud.boost.daemon.messaging

import java.util.*

class ApplicationAuthenticationChangedMessage(payload: Payload) : AbstractMessage<ApplicationAuthenticationChangedMessage.Payload>(payload) {
    data class Payload(
        val applicationId: UUID
    )
}