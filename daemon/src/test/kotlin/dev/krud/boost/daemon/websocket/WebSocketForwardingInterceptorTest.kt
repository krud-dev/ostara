package dev.krud.boost.daemon.websocket

import dev.krud.boost.daemon.websocket.replay.WebSocketForwardingInterceptor
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.messaging.support.GenericMessage

class WebSocketForwardingInterceptorTest {
    private val messagingTemplate = mock<SimpMessagingTemplate>()
    private val subscriber = WebSocketForwardingInterceptor(messagingTemplate, mock())

    @Test
    fun `subscriber should do nothing if topic header is null`() {
        val message = GenericMessage("")
        subscriber.afterSendCompletion(message, mock(), true, null)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should do nothing if topic header is empty`() {
        val message = GenericMessage("", mapOf(WebSocketForwardingInterceptor.TOPIC to ""))
        subscriber.afterSendCompletion(message, mock(), true, null)
        verify(messagingTemplate, never()).convertAndSend("", message.payload)
    }

    @Test
    fun `subscriber should send message to topic`() {
        val message = GenericMessage("", mapOf(WebSocketForwardingInterceptor.TOPIC to "/topic/myTopic"))
        subscriber.afterSendCompletion(message, mock(), true, null)
        verify(messagingTemplate).convertAndSend("/topic/myTopic", message.payload)
    }

    @Test
    fun `subscriber should not send message if sent is false`() {
        val message = GenericMessage("", mapOf(WebSocketForwardingInterceptor.TOPIC to "/topic/myTopic"))
        subscriber.afterSendCompletion(message, mock(), false, null)
        verify(messagingTemplate, never()).convertAndSend("/topic/myTopic", message.payload)
    }
}