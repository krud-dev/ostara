package dev.krud.boost.daemon.configuration.application.websocket

import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
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
        history.forEach {
            messagingTemplate.convertAndSend(APPLICATION_HEALTH_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(event: ApplicationHealthUpdatedEventMessage) {
        messagingTemplate.convertAndSend(APPLICATION_HEALTH_TOPIC, event.payload)
        history.addOrReplaceIf({ event }) { it.payload.applicationId == event.payload.applicationId }
    }

    companion object {
        const val APPLICATION_HEALTH_TOPIC = "/topic/applicationHealth"
    }
}