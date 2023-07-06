package dev.krud.boost.daemon.configuration.instance.websocket

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.metadata.messaing.InstanceMetadataRefreshedMessage
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.test.awaitOrThrow
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.simp.SimpMessagingTemplate
import org.springframework.test.context.ActiveProfiles
import java.util.*
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class InstanceMetadataWebsocketDispatcherTest {
    private val messagingTemplate: SimpMessagingTemplate = mock()
    private val instanceMetadataWebsocketDispatcher = InstanceMetadataWebsocketDispatcher(messagingTemplate)

    @SpringBootTest
    @ActiveProfiles("test")
    class SpringTest {
        @MockBean
        private lateinit var messagingTemplate: SimpMessagingTemplate

        @Autowired
        private lateinit var instanceMetadataRefreshChannel: PublishSubscribeChannel

        @Autowired
        private lateinit var instanceKrud: Krud<Instance, UUID>

        @Test
        fun `on event received should send to websocket`() {
            val instance = instanceKrud.create(stubInstance())
            val message = InstanceMetadataRefreshedMessage(
                InstanceMetadataRefreshedMessage.Payload(
                    instance.id,
                    InstanceMetadataDTO.EMPTY
                )
            )
            val latch = CountDownLatch(1)
            instanceMetadataRefreshChannel.subscribe {
                latch.countDown()
            }
            instanceMetadataRefreshChannel.send(message)
            latch.awaitOrThrow(1000, TimeUnit.MILLISECONDS)
            verify(messagingTemplate, times(1)).convertAndSend(
                InstanceMetadataWebsocketDispatcher.INSTANCE_METADATA_TOPIC,
                message.payload
            )
        }

    }

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