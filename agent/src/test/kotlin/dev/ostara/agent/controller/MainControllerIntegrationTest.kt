package dev.ostara.agent.controller

import dev.ostara.agent.test.IntegrationTest
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.info.BuildProperties
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@IntegrationTest
class MainControllerIntegrationTest {
  @MockBean
  private lateinit var buildProperties: BuildProperties

  @Autowired
  private lateinit var mockMvc: MockMvc

  @Test
  fun `getInfo returns correct version`() {
    whenever(buildProperties.version).thenReturn("1.2.3")
    mockMvc.get("/api/v1/info")
      .andExpect {
        status { isOk() }
        content {
          contentType("application/json")
          jsonPath("$.version") { value("1.2.3") }
        }

      }
  }

}
