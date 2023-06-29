package dev.ostara.agent.servicediscovery.handler

import dev.ostara.agent.configuration.OstaraConfiguration
import dev.ostara.agent.servicediscovery.DiscoveredInstanceDTO

interface ServiceDiscoveryHandler<T : OstaraConfiguration.ServiceDiscovery> {
  fun supports(config: OstaraConfiguration.ServiceDiscovery): Boolean

  fun discoverInstances(
    config: T,
  ): List<DiscoveredInstanceDTO>
}
