package dev.krud.boost.daemon.websocket

import org.junit.jupiter.api.Test
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.springframework.messaging.Message
import org.springframework.messaging.simp.stomp.StompCommand
import org.springframework.messaging.simp.stomp.StompHeaderAccessor
import org.springframework.messaging.support.GenericMessage

class SubscriptionInterceptorTest {
    @Test
    fun `subscription interceptor calls callback on subscription event when sent is true to destination`() {
        val callback = mock<(Message<*>, StompHeaderAccessor) -> Unit>()
        val interceptor = SubscriptionInterceptor("someDestination", callback)
        val message = createMessage(StompCommand.SUBSCRIBE, "someDestination")
        interceptor.afterSendCompletion(
            message,
            mock(),
            true,
            null
        )

        verify(callback).invoke(eq(message), any())
    }

    @Test
    fun `subscription interceptor does not call callback on subscription event when sent is false to destination`() {
        val callback = mock<(Message<*>, StompHeaderAccessor) -> Unit>()
        val interceptor = SubscriptionInterceptor("someDestination", callback)
        val message = createMessage(StompCommand.SUBSCRIBE, "someDestination")
        interceptor.afterSendCompletion(
            message,
            mock(),
            false,
            null
        )

        verify(callback, never()).invoke(eq(message), any())
    }

    @Test
    fun `subscription interceptor does not call callback on subscription event when sent is true to different destination`() {
        val callback = mock<(Message<*>, StompHeaderAccessor) -> Unit>()
        val interceptor = SubscriptionInterceptor("someDestination", callback)
        val message = createMessage(StompCommand.SUBSCRIBE, "someOtherDestination")
        interceptor.afterSendCompletion(
            message,
            mock(),
            true,
            null
        )

        verify(callback, never()).invoke(eq(message), any())
    }

    @Test
    fun `subscription interceptor does not call callback on non subscription event when sent is true to destination`() {
        val callback = mock<(Message<*>, StompHeaderAccessor) -> Unit>()
        val interceptor = SubscriptionInterceptor("someDestination", callback)
        val message = createMessage(StompCommand.CONNECT)
        interceptor.afterSendCompletion(
            message,
            mock(),
            true,
            null
        )

        verify(callback, never()).invoke(eq(message), any())
    }

    private fun createMessage(command: StompCommand, destination: String = "someDestination"): Message<*> {
        val accessor = StompHeaderAccessor.create(
            command,
            mapOf(
                StompHeaderAccessor.STOMP_DESTINATION_HEADER to listOf(destination)
            )
        )
        return GenericMessage("somePayload", accessor.messageHeaders)
    }
}