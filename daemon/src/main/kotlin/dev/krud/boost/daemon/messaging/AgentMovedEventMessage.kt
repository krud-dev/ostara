package dev.krud.boost.daemon.messaging

import java.util.*

class AgentMovedEventMessage(payload: Payload) : AbstractMessage<AgentMovedEventMessage.Payload>(payload) {
    data class Payload(
        val agentId: UUID,
        val oldParentFolderId: UUID?,
        val newParentFolderId: UUID?,
        val newSort: Double?
    )
}