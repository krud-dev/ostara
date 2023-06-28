package dev.krud.boost.daemon.agent.model

data class AgentInfoDTO(
  val version: String,
  val serviceDiscoveryStrategies: List<ServiceDiscoveryStrategyDTO>
)

