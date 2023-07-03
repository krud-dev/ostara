package dev.ostara.agent.filter

import dev.ostara.agent.test.IntegrationTest
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@IntegrationTest
@TestPropertySource(properties = ["ostara.agent.main.api-key=test"])
class AgentAuthenticationFilterIntegrationTest {
  @Autowired
  private lateinit var mockMvc: MockMvc

  @Test
  fun `filter should return bad request when token is provided non ssl`() {
    mockMvc.get("/api/v1") {
      header("X-Ostara-Key", "test")
    }.andExpect {
      status { isBadRequest() }
    }
  }

  @Test
  fun `filter should return unauthorized when token is not provided ssl`() {
    mockMvc.get("/api/v1") {
      secure = true
    }.andExpect {
      status { isBadRequest() }
    }
  }

  @Test
  fun `filter should return unauthorized when token is incorrect ssl`() {
    mockMvc.get("/api/v1") {
      secure = true
      header("X-Ostara-Key", "not-test")
    }.andExpect {
      status { isUnauthorized() }
    }
  }

  @Test
  fun `filter should return ok when token is correct ssl`() {
    mockMvc.get("/api/v1") {
      secure = true
      header("X-Ostara-Key", "test")
    }.andExpect {
      status { isOk() }
    }
  }

  @Test
  fun `filter should return ok when token is not provided non ssl`() {
    mockMvc.get("/api/v1") {
    }.andExpect {
      status { isOk() }
    }
  }
}
