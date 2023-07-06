package dev.krud.boost.daemon.websocket

import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.support.GenericMessage

class WebsocketTransportingSubscriberTest {
    private val messagingTemplate = mock<SimpMessagingTemplate>()
    private val subscriber = WebsocketTransportingSubscriber(messagingTemplate)

    @Test
    fun `subscriber should do nothing if topic header is null`() {
        val message = GenericMessage("")
        subscriber.handleMessage(message)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should do nothing if topic header is empty`() {
        val message = GenericMessage("", mapOf(WebsocketTransportingSubscriber.TOPIC to ""))
        subscriber.handleMessage(message)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should send message to topic`() {
        val message = GenericMessage("", mapOf(WebsocketTransportingSubscriber.TOPIC to "/topic/myTopic"))
        subscriber.handleMessage(message)
        verify(messagingTemplate).convertAndSend("/topic/myTopic", message.payload)
    }

}