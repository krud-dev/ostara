package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.WebsocketForwardingSubscriber
import java.util.*

@GenerateTypescript
class AgentDiscoveryFailedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryFailedEventMessage.Payload>(
    payload,
    WebsocketForwardingSubscriber.TOPIC to "/topic/agentDiscoveryFailure",
    WebsocketForwardingSubscriber.REPLAY_GROUP to payload.agentId.toString()
) {
    data class Payload(
        val agentId: UUID,
        val error: String?
    )
}