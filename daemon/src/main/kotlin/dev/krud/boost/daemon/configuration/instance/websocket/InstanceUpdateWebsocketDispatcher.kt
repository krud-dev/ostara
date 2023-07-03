package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceUpdateWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<InstanceUpdatedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    internal fun onInstanceEvent(event: Message<*>) {
        if (event !is InstanceUpdatedEventMessage) {
            return
        }
        sendToWebSocket(event)
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} instance update events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying instance update event to session: $it" }
            messagingTemplate.convertAndSend(INSTANCE_UPDATE_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: InstanceUpdatedEventMessage) {
        messagingTemplate.convertAndSend(INSTANCE_UPDATE_TOPIC, message.payload)
        log.debug { "Sending instance update event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.instanceId == message.payload.instanceId }
    }

    companion object {
        const val INSTANCE_UPDATE_TOPIC = "/topic/instanceUpdate"
        private val log = KotlinLogging.logger { }
    }
}