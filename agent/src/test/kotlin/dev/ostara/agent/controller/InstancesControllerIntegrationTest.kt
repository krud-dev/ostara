package dev.ostara.agent.controller

import dev.ostara.agent.model.RegistrationRequestDTO
import dev.ostara.agent.service.InternalService
import dev.ostara.agent.test.IntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.ResultActionsDsl
import org.springframework.test.web.servlet.get

@IntegrationTest
class InstancesControllerIntegrationTest {
  @Autowired
  private lateinit var mockMvc: MockMvc

  @Autowired
  private lateinit var internalService: InternalService

  @Test
  @DirtiesContext
  fun `getInstances should return no instances if none were registered`() {
    doGetInstances().andExpect {
      status { isOk() }
      jsonPath("$") { isEmpty() }
    }
  }

  @Test
  @DirtiesContext
  fun `getInstances should return all registered instances`() {
    internalService.doRegister(
      RegistrationRequestDTO(
        "appName",
        "hostName",
        "http://hostname:8080/actuator",
      )
    )
    doGetInstances().andExpect {
      status { isOk() }
      jsonPath("$[0].appName") { value("appName") }
      jsonPath("$[0].id") { value("appName-hostName") }
      jsonPath("$[0].name") { value("hostName") }
      jsonPath("$[0].url") { value("http://hostname:8080/actuator") }
    }
  }

  private fun doGetInstances(): ResultActionsDsl {
    return mockMvc.get("/api/v1/instances")
  }
}
