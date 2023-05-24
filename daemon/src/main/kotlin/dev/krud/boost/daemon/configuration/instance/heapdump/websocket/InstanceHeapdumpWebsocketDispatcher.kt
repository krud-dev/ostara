package dev.krud.boost.daemon.configuration.instance.heapdump.websocket

import dev.krud.boost.daemon.configuration.instance.heapdump.messaging.InstanceHeapdumpDownloadProgressMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceHeapdumpWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<Message<InstanceHeapdumpDownloadProgressMessage.Payload>>()

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} heapdump progress updated events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying heapdump progress updated event to session $sessionId: ${it.payload}" }
            messagingTemplate.convertAndSend(HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    @ServiceActivator(inputChannel = "instanceHeapdumpDownloadProgressChannel")
    fun handleInstanceHeapdumpDownloadProgressMessage(message: Message<InstanceHeapdumpDownloadProgressMessage.Payload>) {
        log.debug { "Sending heapdump download event to websocket: $message" }
        messagingTemplate.convertAndSend(HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.referenceId == message.payload.referenceId }
    }

    companion object {
        const val HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC = "/topic/instanceHeapdumpDownloadProgress"
        private val log = KotlinLogging.logger { }
    }
}