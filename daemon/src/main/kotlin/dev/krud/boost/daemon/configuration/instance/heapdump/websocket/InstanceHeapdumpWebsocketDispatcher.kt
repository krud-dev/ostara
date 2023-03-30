package dev.krud.boost.daemon.configuration.instance.heapdump.websocket

import dev.krud.boost.daemon.configuration.instance.heapdump.messaging.InstanceHeapdumpDownloadProgressMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
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
        history.forEach {
            messagingTemplate.convertAndSend(HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    @ServiceActivator(inputChannel = "instanceHeapdumpDownloadProgressChannel")
    fun handleInstanceHeapdumpDownloadProgressMessage(message: Message<InstanceHeapdumpDownloadProgressMessage.Payload>) {
        messagingTemplate.convertAndSend(HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.referenceId == message.payload.referenceId }
    }

    companion object {
        const val HEAPDUMP_DOWNLOAD_PROGRESS_TOPIC = "/topic/instanceHeapdumpDownloadProgress"
    }
}