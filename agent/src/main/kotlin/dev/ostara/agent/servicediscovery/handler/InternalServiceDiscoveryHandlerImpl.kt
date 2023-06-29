package dev.ostara.agent.servicediscovery.handler

import dev.ostara.agent.configuration.OstaraConfiguration
import dev.ostara.agent.servicediscovery.DiscoveredInstanceDTO
import java.util.*
import kotlin.concurrent.timer


class InternalServiceDiscoveryHandlerImpl : ServiceDiscoveryHandler<OstaraConfiguration.ServiceDiscovery.Internal> {
  private val evictionTimer: Timer
  private val instanceStore = mutableMapOf<Pair<String, String>, Pair<RegistrationRequest, Date>>()

  init {
    evictionTimer = timer("evictInstances", false, period = 30_000) {
      val now = Date()
      instanceStore.entries.removeIf {
        val (_, registeredAt) = it.value
        val diff = now.time - registeredAt.time
        diff > 60_000
      }
    }
  }

  override fun supports(config: OstaraConfiguration.ServiceDiscovery): Boolean {
    return config is OstaraConfiguration.ServiceDiscovery.Internal
  }

  fun doRegister(request: RegistrationRequest) {
    instanceStore[request.appName to request.host] = request to Date()
  }

  fun doUnregister(request: RegistrationRequest) {
    instanceStore.remove(request.appName to request.host)
  }

  override fun discoverInstances(config: OstaraConfiguration.ServiceDiscovery.Internal): List<DiscoveredInstanceDTO> {
    return instanceStore.values.map { (request, _) ->
      DiscoveredInstanceDTO(
        appName = request.appName,
        id = request.host,
        name = request.host,
        url = request.managementUrl
      )
    }
  }

  companion object {
    data class RegistrationRequest(
      val appName: String,
      val host: String,
      val managementUrl: String
    )
  }
}
