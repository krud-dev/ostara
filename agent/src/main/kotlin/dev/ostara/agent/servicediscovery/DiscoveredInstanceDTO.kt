package dev.ostara.agent.servicediscovery

data class DiscoveredInstanceDTO(
  val id: String,
  val name: String,
  val url: String?
)
