package dev.krud.boost.daemon.metricmonitor.websocket

import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleTriggeredMessage
import dev.krud.boost.daemon.utils.addOrReplaceIf
import io.github.oshai.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.stereotype.Component
import java.util.concurrent.CopyOnWriteArrayList

@Component
class MetricRuleWebsocketDispatcher(
    @Lazy
    private val messagingTemplate: SimpMessagingTemplate
) {
    private val history = CopyOnWriteArrayList<ApplicationMetricRuleTriggeredMessage>()

    @ServiceActivator(inputChannel = "applicationMetricRuleTriggerChannel")
    internal fun onEvent(event: ApplicationMetricRuleTriggeredMessage) {
        sendToWebSocket(event)
    }

    fun replay(sessionId: String) {
        log.debug { "Replaying ${history.size} application metric rule events to session $sessionId" }
        history.forEach {
            log.trace {
                "Replaying application metric rule event to session: $it"
            }
            messagingTemplate.convertAndSend(APPLICATION_METRIC_RULE_TRIGGERS_TOPIC, it.payload, mapOf("replay" to true))
        }
    }

    private fun sendToWebSocket(message: ApplicationMetricRuleTriggeredMessage) {
        log.debug { "Sending application metric rule event to websocket: $message" }
        messagingTemplate.convertAndSend(APPLICATION_METRIC_RULE_TRIGGERS_TOPIC, message.payload)
        history.addOrReplaceIf({ message }) { it.payload.applicationMetricRuleId == message.payload.applicationMetricRuleId }
    }

    companion object {
        const val APPLICATION_METRIC_RULE_TRIGGERS_TOPIC = "/topic/applicationMetricRuleTriggers"
        private val log = KotlinLogging.logger { }
    }
}