package dev.krud.boost.daemon.agent.websocket

import dev.krud.boost.daemon.agent.messaging.AgentHealthUpdatedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class AgentHealthWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<AgentHealthUpdatedEventMessage>()

    @ServiceActivator(inputChannel = "agentHealthChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is AgentHealthUpdatedEventMessage -> {
                sendToWebSocket(event)
            }
        }
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} agent health events to session $sessionId" }
        history.forEach {
            log.trace {
                "Replaying agent health event to session: $it"
            }
            messagingTemplate.convertAndSend(AGENT_HEALTH_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: AgentHealthUpdatedEventMessage) {
        log.debug { "Sending agent health event to websocket: $message" }
        messagingTemplate.convertAndSend(AGENT_HEALTH_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.agentId == message.payload.agentId }
    }

    companion object {
        const val AGENT_HEALTH_TOPIC = "/topic/agentHealth"
        private val log = KotlinLogging.logger { }
    }
}