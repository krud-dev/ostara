package dev.krud.boost.daemon.messaging

import java.util.*

class AgentAuthenticationChangedMessage(payload: Payload) : AbstractMessage<AgentAuthenticationChangedMessage.Payload>(payload) {
    data class Payload(
        val agentId: UUID
    )
}