package dev.ostara.agent.model

data class DiscoveredInstanceDTO(
  val appName: String,
  val id: String,
  val name: String,
  val url: String?,
)
