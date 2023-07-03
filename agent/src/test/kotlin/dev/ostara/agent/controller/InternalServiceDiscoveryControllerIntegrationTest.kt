package dev.ostara.agent.controller

import com.fasterxml.jackson.databind.ObjectMapper
import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.service.ServiceDiscoveryService
import dev.ostara.agent.test.IntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.post
import strikt.api.expectThat
import strikt.assertions.isNotNull
import strikt.assertions.isNull

@IntegrationTest
class InternalServiceDiscoveryControllerIntegrationTest {
  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var objectMapper: ObjectMapper

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
    val instance = serviceDiscoveryService.getDiscoveredInstanceById("appName-hostName")
    expectThat(instance).isNotNull()
  }

  @Test
  @DirtiesContext
  fun `deregister should deregister an instance`() {
    doRegister().andReturn()
    doDeregister().andExpect {
      status { isNoContent() }
    }
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
