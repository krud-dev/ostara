package dev.krud.boost.daemon.websocket

import dev.krud.boost.daemon.websocket.replay.WebsocketForwardingSubscriber
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.support.GenericMessage

class WebsocketForwardingSubscriberTest {
    private val messagingTemplate = mock<SimpMessagingTemplate>()
    private val subscriber = WebsocketForwardingSubscriber(messagingTemplate, mock())

    @Test
    fun `subscriber should do nothing if topic header is null`() {
        val message = GenericMessage("")
        subscriber.handleMessage(message)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should do nothing if topic header is empty`() {
        val message = GenericMessage("", mapOf(WebsocketForwardingSubscriber.TOPIC to ""))
        subscriber.handleMessage(message)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should send message to topic`() {
        val message = GenericMessage("", mapOf(WebsocketForwardingSubscriber.TOPIC to "/topic/myTopic"))
        subscriber.handleMessage(message)
        verify(messagingTemplate).convertAndSend("/topic/myTopic", message.payload)
    }

}