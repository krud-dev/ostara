package dev.krud.boost.daemon.websocket

import org.springframework.messaging.Message
import org.springframework.messaging.MessageChannel
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.ChannelInterceptor

/**
 * Intercepts subscription messages and calls a callback when the subscription is successful
 */
class SubscriptionInterceptor(
    val destination: String,
    val callback: (message: Message<*>, headerAccessor: StompHeaderAccessor) -> Unit
) : ChannelInterceptor {
    override fun afterSendCompletion(message: Message<*>, channel: MessageChannel, sent: Boolean, ex: Exception?) {
        if (sent) {
            val accessor = StompHeaderAccessor.wrap(message)
            if (accessor.command == StompCommand.SUBSCRIBE && accessor.destination == destination) {
                callback(message, accessor)
            }
        }
    }
}