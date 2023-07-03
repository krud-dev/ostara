package dev.krud.boost.daemon.configuration.application.websocket

import dev.krud.boost.daemon.configuration.application.messaging.ApplicationUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class ApplicationUpdateWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<ApplicationUpdatedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    internal fun onSystemEvent(event: Message<*>) {
        if (event !is ApplicationUpdatedEventMessage) {
            return
        }
        sendToWebSocket(event)
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} application update events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying application update event to session: $it" }
            messagingTemplate.convertAndSend(APPLICATION_UPDATE_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: ApplicationUpdatedEventMessage) {
        messagingTemplate.convertAndSend(APPLICATION_UPDATE_TOPIC, message.payload)
        log.debug { "Sending application update event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.applicationId == message.payload.applicationId }
    }

    companion object {
        const val APPLICATION_UPDATE_TOPIC = "/topic/applicationUpdate"
        private val log = KotlinLogging.logger { }
    }
}