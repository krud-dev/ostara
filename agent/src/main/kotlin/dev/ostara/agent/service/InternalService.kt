package dev.ostara.agent.service

import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.model.RegistrationRequestDTO
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class InternalService(
  private val timeService: TimeService
) {
  private val instanceStore = mutableMapOf<Pair<String, String>, Pair<RegistrationRequestDTO, Long>>()

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

  fun getInstances(): List<DiscoveredInstanceDTO> {
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
