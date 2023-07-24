package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentDiscoverySucceededEventMessage(payload: Payload) : AbstractMessage<AgentDiscoverySucceededEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.AGENT_DISCOVERY_SUCCESS,
        payload.agentId.toString()
    )
) {
    data class Payload(
        val agentId: UUID
    )
}