package dev.krud.boost.daemon.agent.messaging

import dev.krud.boost.daemon.base.messaging.AbstractMessage
import java.util.*

class AgentAuthenticationChangedMessage(payload: Payload) : AbstractMessage<AgentAuthenticationChangedMessage.Payload>(payload) {
    data class Payload(
        val agentId: UUID
    )
}