package dev.krud.boost.daemon.agent

import dev.krud.boost.daemon.agent.model.Agent

fun stubAgent(name: String = "agentName", url: String = "http://example.com/"): Agent {
    return Agent(
        name = name,
        url = url
    )
}