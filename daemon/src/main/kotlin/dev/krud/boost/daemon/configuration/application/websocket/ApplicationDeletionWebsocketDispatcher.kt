package dev.krud.boost.daemon.configuration.application.websocket

import dev.krud.boost.daemon.configuration.application.messaging.ApplicationDeletedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class ApplicationDeletionWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<ApplicationDeletedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    internal fun onSystemEvent(event: Message<*>) {
        if (event !is ApplicationDeletedEventMessage) {
            return
        }
        sendToWebSocket(event)
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} application deletion events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying application deletion event to session: $it" }
            messagingTemplate.convertAndSend(APPLICATION_DELETION_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: ApplicationDeletedEventMessage) {
        messagingTemplate.convertAndSend(APPLICATION_DELETION_TOPIC, message.payload)
        log.debug { "Sending application deletion event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.applicationId == message.payload.applicationId }
    }

    companion object {
        const val APPLICATION_DELETION_TOPIC = "/topic/applicationDeletion"
        private val log = KotlinLogging.logger { }
    }
}