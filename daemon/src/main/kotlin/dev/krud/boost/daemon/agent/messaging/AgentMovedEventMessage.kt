package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class AgentMovedEventMessage(payload: Payload) : AbstractMessage<AgentMovedEventMessage.Payload>(payload) {
    data class Payload(
        val agentId: UUID,
        val oldParentFolderId: UUID?,
        val newParentFolderId: UUID?,
        val newSort: Double?
    )
}