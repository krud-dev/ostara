package dev.krud.boost.daemon.messaging

import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.websocket.WebsocketTopics
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentHealthUpdatedEventMessage(payload: Payload) : AbstractMessage<AgentHealthUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders(
        WebsocketTopics.AGENT_HEALTH,
        payload.agentId.toString()
    )
) {
    data class Payload(
        val agentId: UUID,
        val oldHealth: AgentHealthDTO,
        val newHealth: AgentHealthDTO
    )
}