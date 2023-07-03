package dev.ostara.agent.controller

import dev.ostara.agent.model.AgentInfoDTO
import dev.ostara.agent.util.API_PREFIX
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(API_PREFIX)
class MainController {
  @GetMapping("/info", produces = ["application/json"])
  fun getInfo(): AgentInfoDTO {
    return AgentInfoDTO(
      version = "0.0.1"
    )
  }
}
