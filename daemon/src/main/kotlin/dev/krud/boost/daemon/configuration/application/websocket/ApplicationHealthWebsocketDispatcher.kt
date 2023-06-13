package dev.krud.boost.daemon.configuration.application.websocket

import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class ApplicationHealthWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<ApplicationHealthUpdatedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is ApplicationHealthUpdatedEventMessage -> {
                sendToWebSocket(event)
            }
        }
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} application health events to session $sessionId" }
        history.forEach {
            log.trace {
                "Replaying application health event to session: $it"
            }
            messagingTemplate.convertAndSend(APPLICATION_HEALTH_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: ApplicationHealthUpdatedEventMessage) {
        log.debug { "Sending application health event to websocket: $message" }
        messagingTemplate.convertAndSend(APPLICATION_HEALTH_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.applicationId == message.payload.applicationId }
    }

    companion object {
        const val APPLICATION_HEALTH_TOPIC = "/topic/applicationHealth"
        private val log = KotlinLogging.logger { }
    }
}