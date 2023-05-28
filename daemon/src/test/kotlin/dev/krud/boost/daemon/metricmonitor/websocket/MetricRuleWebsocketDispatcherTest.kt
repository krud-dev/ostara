package dev.krud.boost.daemon.metricmonitor.websocket

import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.messaging.ApplicationMetricRuleTriggeredMessage
import dev.krud.boost.daemon.utils.ParsedMetricName
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.springframework.messaging.simp.SimpMessagingTemplate
import java.util.*

class MetricRuleWebsocketDispatcherTest {
    private val messagingTemplate: SimpMessagingTemplate = mock()
    private val metricRuleWebsocketDispatcher = MetricRuleWebsocketDispatcher(messagingTemplate)

    @Test
    fun `on event received should send to websocket`() {
        val message = sendMessageToDispatcher()
        verify(messagingTemplate, times(1)).convertAndSend(
            MetricRuleWebsocketDispatcher.APPLICATION_METRIC_RULE_TRIGGERS_TOPIC,
            message.payload
        )
    }

    @Test
    fun `replay should contain recently sent messages`() {
        val message = sendMessageToDispatcher()
        metricRuleWebsocketDispatcher.replay("test")
        verify(messagingTemplate, times(1)).convertAndSend(
            MetricRuleWebsocketDispatcher.APPLICATION_METRIC_RULE_TRIGGERS_TOPIC,
            message.payload,
            mapOf("replay" to true)
        )
    }

    private fun sendMessageToDispatcher(): ApplicationMetricRuleTriggeredMessage {
        val message = ApplicationMetricRuleTriggeredMessage(
            ApplicationMetricRuleTriggeredMessage.Payload(
                UUID.randomUUID(),
                ApplicationMetricRuleOperation.GREATER_THAN,
                UUID.randomUUID(),
                ParsedMetricName.from("test.metric[VALUE]"),
                emptySet()
            )
        )
        metricRuleWebsocketDispatcher.onEvent(message)
        return message
    }

}