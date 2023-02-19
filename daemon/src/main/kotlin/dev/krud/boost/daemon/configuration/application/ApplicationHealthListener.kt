package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class ApplicationHealthListener(
    private val messagingTemplate: SimpMessagingTemplate
) {
    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is ApplicationHealthUpdatedEventMessage -> {
                sendToWebSocket(event)
            }
        }
    }

    private fun sendToWebSocket(event: ApplicationHealthUpdatedEventMessage) {
        messagingTemplate.convertAndSend(APPLICATION_HEALTH_TOPIC, event.payload)
    }

    companion object {
        private const val APPLICATION_HEALTH_TOPIC = "/topic/applicationHealth"
    }
}