package dev.krud.boost.daemon.agent.model

data class ServiceDiscoveryStrategyDTO(
  val type: String,
  val params: List<ParamSchema>
)
