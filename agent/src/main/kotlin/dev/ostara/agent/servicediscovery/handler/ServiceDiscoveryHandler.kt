package dev.ostara.agent.servicediscovery.handler

import dev.ostara.agent.param.model.ParamSchema
import dev.ostara.agent.param.model.Params
import dev.ostara.agent.servicediscovery.DiscoveredInstanceDTO

interface ServiceDiscoveryHandler {
  val type: String
  val params: List<ParamSchema>

  fun discoverInstances(
    config: Params,
  ): List<DiscoveredInstanceDTO>
}
