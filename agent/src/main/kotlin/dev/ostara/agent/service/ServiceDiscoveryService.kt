package dev.ostara.agent.service

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.ServiceDiscoveryProperties.Companion.serviceDiscoveriesWithoutInternal
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.servicediscovery.InternalServiceDiscoveryHandlerImpl
import dev.ostara.agent.servicediscovery.ServiceDiscoveryHandler
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.concurrent.atomic.AtomicReference

@Service
class ServiceDiscoveryService(
  private val serviceDiscoveryProperties: ServiceDiscoveryProperties,
  private val serviceDiscoveryHandlers: List<ServiceDiscoveryHandler<*>>,
  @Autowired(required = false)
  private val internalServiceDiscoveryHandlerImpl: InternalServiceDiscoveryHandlerImpl?
) {
  private val discoveredInstances = AtomicReference<List<DiscoveredInstanceDTO>>(listOf())

  fun getDiscoveredInstances(): List<DiscoveredInstanceDTO> {
    return discoveredInstances.get() + getInternalInstances()
  }

  fun getDiscoveredInstanceById(id: String): DiscoveredInstanceDTO? {
    return getDiscoveredInstances().find { it.id == id }
  }

  @Scheduled(fixedDelay = 30_000)
  fun runDiscovery() {
    log.debug("Running instance discovery")
    val discoveredInstances = mutableListOf<DiscoveredInstanceDTO>()
    serviceDiscoveryProperties.serviceDiscoveriesWithoutInternal.forEach { serviceDiscoverySettings ->
      val handler =
        serviceDiscoveryHandlers.find { it.supports(serviceDiscoverySettings) } as ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery>?
      if (handler != null) {
        discoveredInstances.addAll(handler.discoverInstances(serviceDiscoverySettings))
      }
    }
    this.discoveredInstances.set(discoveredInstances.toList())
  }

  private fun getInternalInstances(): List<DiscoveredInstanceDTO> {
    return internalServiceDiscoveryHandlerImpl?.discoverInstances(serviceDiscoveryProperties.internal) ?: emptyList()
  }

  companion object {
    private val log = KotlinLogging.logger { }
  }
}
