package dev.krud.boost.daemon.configuration.instance.hostname

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.messaging.InstanceUpdatedEventMessage
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Component

@Component
class InstanceHostnameListener(
    private val instanceHostnameService: InstanceHostnameService
) {
    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                instanceHostnameService.resolveAndUpdateHostname(event.payload.instanceId)
            }
            is InstanceUpdatedEventMessage -> {
                instanceHostnameService.resolveAndUpdateHostname(event.payload.instanceId)
            }
            is InstanceHealthChangedEventMessage -> {
                val payload = event.payload
                val shouldRefreshHostname = payload.newHealth.status.running &&
                    !payload.oldHealth.status.running &&
                    payload.oldHealth.status != InstanceHealthStatus.PENDING
                if (shouldRefreshHostname) {
                    instanceHostnameService.resolveAndUpdateHostname(payload.instanceId)
                }
            }
        }
    }
}