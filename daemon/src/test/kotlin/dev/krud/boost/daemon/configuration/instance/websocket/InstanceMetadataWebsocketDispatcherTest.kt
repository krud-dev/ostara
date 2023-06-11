package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.metadata.messaing.InstanceMetadataRefreshedMessage
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.springframework.messaging.simp.SimpMessagingTemplate

class InstanceMetadataWebsocketDispatcherTest {
    private val messagingTemplate: SimpMessagingTemplate = mock()
    private val instanceMetadataWebsocketDispatcher = InstanceMetadataWebsocketDispatcher(messagingTemplate)

    @Test
    fun `on event received should send to websocket`() {
        val message = sendMessageToDispatcher()
        verify(messagingTemplate, times(1)).convertAndSend(
            InstanceMetadataWebsocketDispatcher.INSTANCE_METADATA_TOPIC,
            message.payload
        )
    }

    @Test
    fun `replay should contain recently sent messages`() {
        val message = sendMessageToDispatcher()
        instanceMetadataWebsocketDispatcher.replay("test")
        verify(messagingTemplate, times(1)).convertAndSend(
            InstanceMetadataWebsocketDispatcher.INSTANCE_METADATA_TOPIC,
            message.payload,
            mapOf("replay" to true)
        )
    }

    private fun sendMessageToDispatcher(): InstanceMetadataRefreshedMessage {
        val message = InstanceMetadataRefreshedMessage(
            InstanceMetadataRefreshedMessage.Payload(
                stubInstance().id,
                InstanceMetadataDTO()
            )
        )
        instanceMetadataWebsocketDispatcher.onInstanceEvent(message)
        return message
    }
}