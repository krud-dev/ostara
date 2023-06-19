package dev.ostara.model

data class AgentInfoDTO(
  val version: String,
  val serviceDiscoveryStrategies: List<ServiceDiscoveryStrategyDTO>
)

