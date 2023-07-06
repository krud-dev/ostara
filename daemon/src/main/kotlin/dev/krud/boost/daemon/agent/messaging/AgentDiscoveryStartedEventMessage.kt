package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.WebsocketTransportingSubscriber
import java.util.*

@GenerateTypescript
class AgentDiscoveryStartedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryStartedEventMessage.Payload>(
    payload,
    WebsocketTransportingSubscriber.TOPIC to "/topic/agentDiscoveryStart"
) {
    data class Payload(
        val agentId: UUID
    )
    init {
        headers[WebsocketTransportingSubscriber.TOPIC] = "/topic/agentDiscoveryStart"
    }
}