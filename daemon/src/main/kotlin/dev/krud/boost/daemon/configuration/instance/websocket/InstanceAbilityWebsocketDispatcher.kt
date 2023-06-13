package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.messaging.InstanceAbilitiesRefreshedEventMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class InstanceAbilityWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<InstanceAbilitiesRefreshedEventMessage>()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceAbilitiesRefreshedEventMessage -> sendToWebSocket(event)
        }
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} instance health events to session $sessionId" }
        history.forEach {
            log.trace { "Replaying instance health event to session: $it" }
            messagingTemplate.convertAndSend(INSTANCE_ABILITY_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: InstanceAbilitiesRefreshedEventMessage) {
        messagingTemplate.convertAndSend(INSTANCE_ABILITY_TOPIC, message.payload)
        log.debug { "Sending instance abilities refreshed event to websocket: $message" }
        history.addOrReplaceIf({ message }) { it.payload.instanceId == message.payload.instanceId }
    }

    companion object {
        const val INSTANCE_ABILITY_TOPIC = "/topic/instanceAbility"
        private val log = KotlinLogging.logger { }
    }
}