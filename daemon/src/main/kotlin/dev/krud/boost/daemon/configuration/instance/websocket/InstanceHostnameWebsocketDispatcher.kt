package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHostnameUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceHostnameWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<InstanceHostnameUpdatedEventMessage>()

    fun replay(sessionId: String) {
        history.forEach {
            messagingTemplate.convertAndSend(INSTANCE_HOSTNAME_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    @ServiceActivator(inputChannel = "instanceHostnameUpdatedChannel")
    protected fun onHostnameUpdated(message: InstanceHostnameUpdatedEventMessage) {
        sendToWebSocket(message)
    }

    private fun sendToWebSocket(message: InstanceHostnameUpdatedEventMessage) {
        messagingTemplate.convertAndSend(INSTANCE_HOSTNAME_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.instanceId == message.payload.instanceId }
    }

    companion object {
        const val INSTANCE_HOSTNAME_TOPIC = "/topic/instanceHostname"
    }
}