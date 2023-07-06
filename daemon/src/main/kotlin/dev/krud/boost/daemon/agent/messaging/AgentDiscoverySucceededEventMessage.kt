package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.WebsocketTransportingSubscriber
import java.util.*

@GenerateTypescript
class AgentDiscoverySucceededEventMessage(payload: Payload) : AbstractMessage<AgentDiscoverySucceededEventMessage.Payload>(
    payload,
    WebsocketTransportingSubscriber.TOPIC to "/topic/agentDiscoverySuccess"
) {
    data class Payload(
        val agentId: UUID
    )
}