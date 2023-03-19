package dev.krud.boost.daemon.configuration.application.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import java.util.*

class ApplicationHealthUpdatedEventMessage(payload: Payload) : AbstractMessage<ApplicationHealthUpdatedEventMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val applicationId: UUID,
        val newHealth: ApplicationHealthRO
    )
}