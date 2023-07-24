package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import java.util.*

/**
 * As opposed to [InstanceHealthChangedEventMessage], this message is sent when the health check is performed even if the health status hasn't changed.
 */
class InstanceHealthCheckPerformedEventMessage(payload: Payload) : AbstractMessage<InstanceHealthCheckPerformedEventMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val parentApplicationId: UUID,
        val instanceId: UUID,
        val oldHealth: InstanceHealthRO,
        val newHealth: InstanceHealthRO
    )
}