package dev.krud.boost.daemon.websocket

import org.springframework.context.annotation.Lazy
import org.springframework.messaging.Message
import org.springframework.messaging.MessageHandler
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class WebsocketTransportingSubscriber(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) : MessageHandler {
    override fun handleMessage(message: Message<*>) {
        val topic = message.headers[TOPIC]?.toString()
        if (!topic.isNullOrBlank()) {
            messagingTemplate.convertAndSend(topic, message.payload)
        }
    }

    companion object {
        const val TOPIC = "X-Websocket-Topic"
    }
}