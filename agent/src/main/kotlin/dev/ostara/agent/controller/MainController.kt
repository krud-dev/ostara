package dev.ostara.agent.controller

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.ServiceDiscoveryProperties.Companion.serviceDiscoveries
import dev.ostara.agent.model.AgentInfoDTO
import dev.ostara.agent.util.API_PREFIX
import org.springframework.boot.info.BuildProperties
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(API_PREFIX)
class MainController(
  private val buildProperties: BuildProperties,
  private val serviceDiscoveryProperties: ServiceDiscoveryProperties
) {
  @GetMapping(produces = ["application/json"])
  fun getInfo(): AgentInfoDTO {
    return AgentInfoDTO(
      version = buildProperties.version,
      sources = serviceDiscoveryProperties.serviceDiscoveries.map { it::class.simpleName!! }.toSet()
    )
  }
}
