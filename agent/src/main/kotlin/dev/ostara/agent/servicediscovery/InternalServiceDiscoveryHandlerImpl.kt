package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.model.RegistrationRequestDTO
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.*
import javax.annotation.PostConstruct

@Component
class InternalServiceDiscoveryHandlerImpl : ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Internal> {
  private val instanceStore = mutableMapOf<Pair<String, String>, Pair<RegistrationRequestDTO, Date>>()

  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Internal
  }

  @Scheduled(fixedDelay = 30_000)
  fun evictStale() {
    val now = Date()
    instanceStore.entries.removeIf {
      val (_, registeredAt) = it.value
      val diff = now.time - registeredAt.time
      diff > 60_000
    }
  }

  fun doRegister(request: RegistrationRequestDTO) {
    instanceStore[request.appName to request.host] = request to Date()
  }

  fun doUnregister(request: RegistrationRequestDTO) {
    instanceStore.remove(request.appName to request.host)
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Internal): List<DiscoveredInstanceDTO> {
    return instanceStore.values.map { (request, _) ->
      DiscoveredInstanceDTO(
        appName = request.appName,
        id = "${request.appName}-${request.host}",
        name = request.host,
        url = request.managementUrl
      )
    }
  }
}
