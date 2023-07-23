package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.websocket.replay.webSocketHeaders
import java.util.*

@GenerateTypescript
class AgentHealthUpdatedEventMessage(payload: Payload) : AbstractMessage<AgentHealthUpdatedEventMessage.Payload>(
    payload,
    *webSocketHeaders("/topic/agentHealth", payload.agentId.toString())
) {
    data class Payload(
        val agentId: UUID,
        val oldHealth: AgentHealthDTO,
        val newHealth: AgentHealthDTO
    )
}