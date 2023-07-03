package dev.krud.boost.daemon.agent.model

data class DiscoveredInstanceDTO(
    val appName: String,
    val id: String,
    val name: String,
    val url: String?,
)
