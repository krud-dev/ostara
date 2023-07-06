package dev.krud.boost.daemon.websocket.replay

import dev.krud.boost.daemon.utils.addOrReplaceIf
import org.springframework.messaging.Message
import org.springframework.stereotype.Component
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList

@Component
class WebsocketReplayStore {
    private val store: MutableMap<String, CopyOnWriteArrayList<StoredMessage>> = ConcurrentHashMap()
    fun get(topic: String): List<Message<*>> {
        return store[topic]?.map { it.message } ?: emptyList()
    }

    fun add(topic: String, message: Message<*>, replayGroup: String?) {
        val list = store.computeIfAbsent(topic) {
            CopyOnWriteArrayList()
        }
        if (replayGroup != null) {
            list.addOrReplaceIf({ StoredMessage(message, replayGroup) }) { it.replayGroup == replayGroup }
        } else {
            list.add(StoredMessage(message, null))
        }
    }

    companion object {
        private data class StoredMessage(
            val message: Message<*>,
            val replayGroup: String?
        )
    }
}