package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
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
class InstanceCrudWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<Message<*>>()

    @ServiceActivator(inputChannel = "instanceMetadataRefreshChannel")
    internal fun onInstanceEvent(event: Message<*>) {
        if (event::class !in SUPPORTED_EVENTS) {
            return
        }
        sendToWebSocket(event)
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} instance crud events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying instance crud event to session: $it" }
            messagingTemplate.convertAndSend(INSTANCE_CRUD_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: Message<*>) {
        messagingTemplate.convertAndSend(INSTANCE_CRUD_TOPIC, message.payload)
        log.debug { "Sending instance crud event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.instanceId == message.instanceId }
    }

    companion object {
        private val Message<*>.instanceId get() = when (this) {
            is InstanceCreatedEventMessage -> payload.instanceId
            is InstanceUpdatedEventMessage -> payload.instanceId
            is InstanceDeletedEventMessage -> payload.instanceId
            else -> error("Unsupported message type: ${this::class}")
        }

        val SUPPORTED_EVENTS = listOf(
            InstanceCreatedEventMessage::class,
            InstanceUpdatedEventMessage::class,
            InstanceDeletedEventMessage::class
        )

        const val INSTANCE_CRUD_TOPIC = "/topic/instanceCrud"
        private val log = KotlinLogging.logger { }
    }
}