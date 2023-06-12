package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.metadata.messaing.InstanceMetadataRefreshedMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceMetadataWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<InstanceMetadataRefreshedMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    internal fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceMetadataRefreshedMessage -> sendToWebSocket(event)
        }
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} instance metadata refresh events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying instance metadata refreshed event to session: $it" }
            messagingTemplate.convertAndSend(INSTANCE_METADATA_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: InstanceMetadataRefreshedMessage) {
        messagingTemplate.convertAndSend(INSTANCE_METADATA_TOPIC, message.payload)
        log.debug { "Sending instance metadata refreshed event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.instanceId == message.payload.instanceId }
    }

    companion object {
        const val INSTANCE_METADATA_TOPIC = "/topic/instanceMetadata"
        private val log = KotlinLogging.logger { }
    }
}