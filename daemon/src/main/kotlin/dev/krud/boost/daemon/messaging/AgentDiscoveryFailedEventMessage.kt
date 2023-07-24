package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentDiscoveryFailedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryFailedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.AGENT_DISCOVERY_FAILURE,
        payload.agentId.toString()
    )
) {
    data class Payload(
        val agentId: UUID,
        val error: String?
    )
}