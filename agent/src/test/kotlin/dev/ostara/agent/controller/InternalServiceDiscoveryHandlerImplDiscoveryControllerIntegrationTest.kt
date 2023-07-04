package dev.ostara.agent.controller

import com.fasterxml.jackson.databind.ObjectMapper
import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.servicediscovery.InternalServiceDiscoveryHandlerImpl
import dev.ostara.agent.service.ServiceDiscoveryService
import dev.ostara.agent.service.TimeService
import dev.ostara.agent.test.IntegrationTest
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.post
import strikt.api.expectThat
import strikt.assertions.isNotNull
import strikt.assertions.isNull

@IntegrationTest
@TestPropertySource(properties = ["app.scheduling.enable=false"])
class InternalServiceDiscoveryHandlerImplDiscoveryControllerIntegrationTest {
  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @MockBean
  private lateinit var timeService: TimeService

  @Autowired
  private lateinit var internalServiceDiscoveryHandlerImpl: InternalServiceDiscoveryHandlerImpl

  @Autowired
  private lateinit var serviceDiscoveryService: ServiceDiscoveryService

  private val dto = RegistrationRequestDTO(
    "appName",
    "hostName",
    "http://hostname:8080/actuator",
  )

  @Test
  @DirtiesContext
  fun `register should register an instance`() {
    doRegister().andExpect {
      status { isCreated() }
    }
    serviceDiscoveryService.runDiscovery()
    val instance = serviceDiscoveryService.getDiscoveredInstanceById("appName-hostName")
    expectThat(instance).isNotNull()
  }

  @Test
  @DirtiesContext
  fun `registered instance should be removed after 60 seconds`() {
    whenever(timeService.currentTimeMillis()).thenReturn(0)
    doRegister().andReturn()
    serviceDiscoveryService.runDiscovery()
    whenever(timeService.currentTimeMillis()).thenReturn(61_000)
    internalServiceDiscoveryHandlerImpl.evictStale()
    serviceDiscoveryService.runDiscovery()
    expectThat(serviceDiscoveryService.getDiscoveredInstanceById("appName-hostName")).isNull()
  }

  @Test
  @DirtiesContext
  fun `deregister should deregister an instance`() {
    doRegister().andReturn()
    serviceDiscoveryService.runDiscovery()
    doDeregister().andExpect {
      status { isNoContent() }
    }
    serviceDiscoveryService.runDiscovery()
    val instance = serviceDiscoveryService.getDiscoveredInstanceById("appName-hostName")
    expectThat(instance).isNull()
  }

  private fun doRegister(): ResultActionsDsl {
    return mockMvc.post("/api/v1/internal/service-discovery/register") {
      content = objectMapper.writeValueAsString(dto)
      contentType = MediaType.APPLICATION_JSON
    }
  }

  private fun doDeregister(): ResultActionsDsl {
    return mockMvc.post("/api/v1/internal/service-discovery/deregister") {
      content = objectMapper.writeValueAsString(dto)
      contentType = MediaType.APPLICATION_JSON
    }
  }
}
