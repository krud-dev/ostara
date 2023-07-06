package dev.krud.boost.daemon.websocket.replay

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor
import org.springframework.stereotype.Component

@Component
class InboundWebsocketReplayingInterceptor(
    private val store: WebsocketReplayStore,
    private val messagingTemplate: SimpMessagingTemplate
) : ChannelInterceptor {
    override fun afterSendCompletion(message: Message<*>, channel: MessageChannel, sent: Boolean, ex: Exception?) {
        if (sent) {
            val accessor = StompHeaderAccessor.wrap(message)
            if (accessor.command == StompCommand.SUBSCRIBE) {
                if (accessor.destination != null) {
                    log.debug { "Replaying ${store.get(accessor.destination!!).size} messages to ${accessor.sessionId} on ${accessor.destination}" }
                    store.get(accessor.destination!!).forEach {
                        messagingTemplate.convertAndSend(accessor.destination!!, it.payload, mapOf("X-Replayed" to true))
                    }
                }
            }
        }
    }

    companion object {
        private val log = KotlinLogging.logger {}
    }
}