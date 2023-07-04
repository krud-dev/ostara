package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnInternalEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.service.TimeService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
@ConditionalOnInternalEnabled
class InternalServiceDiscoveryHandlerImpl(
  private val timeService: TimeService
) : ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Internal> {
  private val instanceStore = mutableMapOf<Pair<String, String>, Pair<RegistrationRequestDTO, Long>>()

  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Internal
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

  @Scheduled(fixedDelay = 30_000)
  fun evictStale() {
    val now = timeService.currentTimeMillis()
    instanceStore.entries.removeIf {
      val (_, registeredAt) = it.value
      val diff = now - registeredAt
      diff > 60_000
    }
  }

  fun doRegister(request: RegistrationRequestDTO) {
    instanceStore[request.appName to request.host] = request to timeService.currentTimeMillis()
  }

  fun doUnregister(request: RegistrationRequestDTO) {
    instanceStore.remove(request.appName to request.host)
  }
}
