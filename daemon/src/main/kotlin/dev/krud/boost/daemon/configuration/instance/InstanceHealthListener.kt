package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.eventlog.EventLogService
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class InstanceHealthListener(
    private val messagingTemplate: SimpMessagingTemplate,
    private val eventLogService: EventLogService
) {
    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                sendToWebSocket(event)
                createEventLog(event)
            }
        }
    }

    private fun sendToWebSocket(event: InstanceHealthChangedEventMessage) {
        messagingTemplate.convertAndSend(INSTANCE_HEALTH_TOPIC, event.payload)
    }

    private fun createEventLog(event: InstanceHealthChangedEventMessage) {
        val (_, instanceId, oldHealth, newStatus) = event.payload
        val severity = if (oldHealth.status == InstanceHealthStatus.UP) {
            EventLogSeverity.ERROR
        } else {
            EventLogSeverity.INFO
        }

        // TODO: Re-enable when needed
//        eventLogService.logEvent(
//            EventLogType.INSTANCE_HEALTH_CHANGED,
//            instanceId,
//            "Instance $instanceId ] health status changed from $oldStatus to $newStatus",
//            severity
//        )
    }

    companion object {
        private const val INSTANCE_HEALTH_TOPIC = "/topic/instanceHealth"
    }
}