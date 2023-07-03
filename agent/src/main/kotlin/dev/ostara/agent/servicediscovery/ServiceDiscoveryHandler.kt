package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.model.DiscoveredInstanceDTO

interface ServiceDiscoveryHandler<T : ServiceDiscoveryProperties.ServiceDiscovery> {
  fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean

  fun discoverInstances(
    config: T,
  ): List<DiscoveredInstanceDTO>
}
