package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus
import java.util.*

class ApplicationHealthUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationHealthUpdatedEventMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val applicationId: UUID,
        val newStatus: ApplicationHealthStatus
    )
}