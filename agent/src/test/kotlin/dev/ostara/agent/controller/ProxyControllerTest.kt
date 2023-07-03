package dev.ostara.agent.controller

import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.service.ServiceDiscoveryService
import dev.ostara.agent.servicediscovery.InternalServiceDiscoveryHandlerImpl
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post

@SpringBootTest
@AutoConfigureMockMvc
class ProxyControllerTest {

  @Autowired
  private lateinit var serviceDiscoveryService: ServiceDiscoveryService

  @Autowired
  private lateinit var internalServiceDiscoveryHandlerImpl: InternalServiceDiscoveryHandlerImpl

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Test
  fun `doCall should relay call if instance exists`() {
    val registration = RegistrationRequestDTO(
      "someApp",
      "someHost",
      "http://localhost:13333/actuator"
    )
    internalServiceDiscoveryHandlerImpl.doRegister(
      registration
    )
    serviceDiscoveryService.runDiscovery()

    val response = mockMvc.get(
      "/api/v1/proxy/health"
    ) {
      header("X-Ostara-InstanceId", "someApp-someHost")
    }
      .andReturn()
    println()
  }
}
