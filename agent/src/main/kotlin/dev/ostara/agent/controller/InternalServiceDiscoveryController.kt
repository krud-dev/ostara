package dev.ostara.agent.controller

import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.servicediscovery.InternalServiceDiscoveryHandlerImpl
import dev.ostara.agent.util.API_PREFIX
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("$API_PREFIX/internal/service-discovery")
class InternalServiceDiscoveryController(
  private val internalService: InternalServiceDiscoveryHandlerImpl
) {
  @PostMapping("/register")
  @ResponseStatus(HttpStatus.CREATED)
  fun register(@RequestBody request: RegistrationRequestDTO) {
    internalService.doRegister(request)
  }

  @PostMapping("/deregister")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  fun deregister(@RequestBody request: RegistrationRequestDTO) {
    internalService.doUnregister(request)
  }
}
