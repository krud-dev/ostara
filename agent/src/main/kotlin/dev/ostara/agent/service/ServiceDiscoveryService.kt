package dev.ostara.agent.service

import dev.ostara.agent.configuration.OstaraConfiguration
import dev.ostara.agent.servicediscovery.DiscoveredInstanceDTO
import dev.ostara.agent.servicediscovery.handler.ServiceDiscoveryHandler
import io.ktor.util.logging.*
import java.util.*
import java.util.concurrent.atomic.AtomicReference
import kotlin.concurrent.timer

class ServiceDiscoveryService(
  private val ostaraConfiguration: OstaraConfiguration,
  private val serviceDiscoveryHandlers: List<ServiceDiscoveryHandler<OstaraConfiguration.ServiceDiscovery>>
) {
  private val discoveredInstances = AtomicReference<List<DiscoveredInstanceDTO>>(listOf())
  private val scheduler: Timer
  init {
    scheduler = timer("discoverInstances", false, period = 60000) {
      runDiscovery()
    }
  }

  fun getDiscoveredInstances(): List<DiscoveredInstanceDTO> {
    return discoveredInstances.get()
  }

  fun runDiscovery() {
    log.debug("Running instance discovery")
    val discoveredInstances = mutableListOf<DiscoveredInstanceDTO>()
    ostaraConfiguration.serviceDiscoveries.forEach { serviceDiscovery ->
      val handler = serviceDiscoveryHandlers.find { it.supports(serviceDiscovery) }
      if (handler != null) {
        discoveredInstances.addAll(handler.discoverInstances(serviceDiscovery))
      }
    }
    this.discoveredInstances.set(discoveredInstances.toList())
  }

  companion object {
    private val log = KtorSimpleLogger(ServiceDiscoveryService::class.qualifiedName!!)
  }
}
