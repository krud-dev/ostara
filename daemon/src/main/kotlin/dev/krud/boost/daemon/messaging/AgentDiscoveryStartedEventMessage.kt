package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentDiscoveryStartedEventMessage(payload: Payload) : AbstractMessage<AgentDiscoveryStartedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.AGENT_DISCOVERY_START,
        payload.agentId.toString()
    )
) {
    data class Payload(
        val agentId: UUID
    )
}