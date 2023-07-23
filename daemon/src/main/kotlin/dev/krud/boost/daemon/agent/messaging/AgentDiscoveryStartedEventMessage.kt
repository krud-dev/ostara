package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentDiscoveryStartedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryStartedEventMessage.Payload>(
    payload,
    *webSocketHeaders("/topic/agentDiscoveryStart", payload.agentId.toString())
) {
    data class Payload(
        val agentId: UUID
    )
}