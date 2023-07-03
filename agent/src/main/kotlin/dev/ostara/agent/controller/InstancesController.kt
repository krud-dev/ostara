package dev.ostara.agent.controller

import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.service.ServiceDiscoveryService
import dev.ostara.agent.util.API_PREFIX
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_PREFIX/instances")
class InstancesController(
  private val serviceDiscoveryService: ServiceDiscoveryService
) {
  @GetMapping
  fun getInstances(): List<DiscoveredInstanceDTO> {
    return serviceDiscoveryService.getDiscoveredInstances()
  }
}
