package dev.krud.boost.daemon.threadprofiling.websocket

import dev.krud.boost.daemon.threadprofiling.messaging.ThreadProfilingProgressMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class ThreadProfilingWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<Message<ThreadProfilingProgressMessage.Payload>>()

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} thread profiling events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying thread profiling event to session $sessionId: ${it.payload}" }
            messagingTemplate.convertAndSend(THREAD_PROFILING_PROGRESS_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    @ServiceActivator(inputChannel = "instanceThreadProfilingProgressChannel")
    fun handleMessage(message: Message<ThreadProfilingProgressMessage.Payload>) {
        log.debug { "Sending thread profiling event to websocket: $message" }
        messagingTemplate.convertAndSend(THREAD_PROFILING_PROGRESS_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.requestId == message.payload.requestId }
    }

    companion object {
        const val THREAD_PROFILING_PROGRESS_TOPIC = "/topic/instanceThreadProfilingProgress"
        private val log = KotlinLogging.logger { }
    }
}