package dev.krud.boost.daemon.websocket.replay

import org.springframework.context.annotation.Lazy
import org.springframework.messaging.Message
import org.springframework.messaging.MessageHandler
import org.springframework.messaging.MessageHeaders
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component

@Component
class WebsocketForwardingSubscriber(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate,
    private val store: WebsocketReplayStore
) : MessageHandler {
    override fun handleMessage(message: Message<*>) {
        val topic = message.headers.topic()
        if (!topic.isNullOrBlank()) {
            if (message.headers.shouldReplay()) {
                storeForReplay(topic, message)
            }
            messagingTemplate.convertAndSend(topic, message.payload)
        }
    }

    private fun storeForReplay(topic: String, message: Message<*>) {
        val replayGroup = message.headers.replayGroupBy()
        store.add(topic, message, replayGroup)
    }

    companion object {
        private fun MessageHeaders.topic(): String? = this[TOPIC]?.toString()
        private fun MessageHeaders.shouldReplay(): Boolean = !(this[NO_REPLAY]?.toString()?.toBoolean() ?: false)
        private fun MessageHeaders.replayGroupBy(): String? = this[REPLAY_GROUP]?.toString()

        /**
         * If this header is present, the websocket message will be sent to the topic specified
         */
        const val TOPIC = "X-Websocket-Topic"

        /**
         * If this header is present, the websocket replay mechanism will not store this message
         */
        const val NO_REPLAY = "X-Websocket-No-Replay"

        /**
         * If this header is present, the websocket replay mechanism will group messages by this value and only replay the last message in each group
         */
        const val REPLAY_GROUP = "X-Websocket-Replay-Group"
    }
}