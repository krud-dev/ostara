package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent
import java.util.*

fun stubAgent(id: UUID = UUID.randomUUID(), name: String = "agentName", url: String = "http://example.com/"): Agent {
    return Agent(
        name = name,
        url = url
    ).apply {
        this.id = id
    }
}