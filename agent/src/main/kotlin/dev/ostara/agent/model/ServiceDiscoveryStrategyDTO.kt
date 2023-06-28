package dev.ostara.agent.model

import dev.ostara.agent.param.model.ParamSchema

data class ServiceDiscoveryStrategyDTO(
  val type: String,
  val params: List<ParamSchema>
)
