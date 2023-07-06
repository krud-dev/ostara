package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.WebsocketTransportingSubscriber
import java.util.*

@GenerateTypescript
class AgentDiscoveryFailedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryFailedEventMessage.Payload>(
    payload,
    WebsocketTransportingSubscriber.TOPIC to "/topic/agentDiscoveryFailure"
) {
    data class Payload(
        val agentId: UUID,
        val error: String?
    )
}