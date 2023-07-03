package dev.krud.boost.daemon.configuration.instance.websocket

import org.mockito.kotlin.mock
import org.springframework.messaging.simp.SimpMessagingTemplate

class InstanceCrudWebsocketDispatcherTest {
    private val messagingTemplate: SimpMessagingTemplate = mock()
    private val instanceCreationWebsocketDispatcher = InstanceCreationWebsocketDispatcher(messagingTemplate)
}