package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.WebsocketForwardingSubscriber
import java.util.*

@GenerateTypescript
class AgentDiscoverySucceededEventMessage(payload: Payload) : AbstractMessage<AgentDiscoverySucceededEventMessage.Payload>(
    payload,
    WebsocketForwardingSubscriber.TOPIC to "/topic/agentDiscoverySuccess",
    WebsocketForwardingSubscriber.REPLAY_GROUP to payload.agentId.toString()
) {
    data class Payload(
        val agentId: UUID
    )
}