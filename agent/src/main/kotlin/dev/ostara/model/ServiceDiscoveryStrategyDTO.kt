package dev.ostara.model

import dev.ostara.param.model.ParamSchema

data class ServiceDiscoveryStrategyDTO(
  val type: String,
  val params: List<ParamSchema>
)
