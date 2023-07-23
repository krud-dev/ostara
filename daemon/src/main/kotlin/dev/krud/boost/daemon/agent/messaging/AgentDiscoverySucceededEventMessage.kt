package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentDiscoverySucceededEventMessage(payload: Payload) : AbstractMessage<AgentDiscoverySucceededEventMessage.Payload>(
    payload,
    *webSocketHeaders("/topic/agentDiscoverySuccess", payload.agentId.toString())
) {
    data class Payload(
        val agentId: UUID
    )
}