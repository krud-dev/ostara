package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.eventlog.EventLogService
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceHealthWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate,
    private val eventLogService: EventLogService
) {
    private val history = CopyOnWriteArrayList<InstanceHealthChangedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                sendToWebSocket(event)
                createEventLog(event)
            }
        }
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} instance health events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying instance health event to session: $it" }
            messagingTemplate.convertAndSend(INSTANCE_HEALTH_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: InstanceHealthChangedEventMessage) {
        messagingTemplate.convertAndSend(INSTANCE_HEALTH_TOPIC, message.payload)
        log.debug { "Sending instance health event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.instanceId == message.payload.instanceId }
    }

    private fun createEventLog(event: InstanceHealthChangedEventMessage) {
        log.debug { "Creating event log for instance health event: $event" }
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
        const val INSTANCE_HEALTH_TOPIC = "/topic/instanceHealth"
        private val log = KotlinLogging.logger { }
    }
}