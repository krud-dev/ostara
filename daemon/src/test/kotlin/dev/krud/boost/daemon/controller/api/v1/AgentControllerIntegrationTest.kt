package dev.krud.boost.daemon.controller.api.v1

import com.fasterxml.jackson.databind.ObjectMapper
import dev.krud.boost.daemon.IntegrationTest
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.ro.AgentModifyRequestRO
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.http.MediaType.APPLICATION_JSON
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.post
import java.util.*

@IntegrationTest
@AutoConfigureMockMvc
class AgentControllerIntegrationTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Autowired
    private lateinit var agentKrud: Krud<Agent, UUID>

    private val validHttpAgent = AgentModifyRequestRO(
        name = "test",
        url = "http://localhost:8080",
        apiKey = null
    )

    private val validHttpAgentWithApiKey = AgentModifyRequestRO(
        name = "test",
        url = "http://localhost:8080",
        apiKey = "test"
    )

    private val validHttpsAgent = AgentModifyRequestRO(
        name = "test",
        url = "https://localhost:8080",
        "test"
    )

    private val validHttpsAgentWithoutApiKey = AgentModifyRequestRO(
        name = "test",
        url = "https://localhost:8080",
        null
    )

    private val agentWithInvalidUrl = AgentModifyRequestRO(
        name = "test",
        url = "invalid",
        apiKey = null
    )

    @Test
    fun `create agent with http url and no api key should return 201`() {
        mockMvc.post("/api/v1/agents") {
            contentType = APPLICATION_JSON
            content = validHttpAgent.let(objectMapper::writeValueAsString)
        }
            .andExpect {
                status {
                    isCreated()
                }
                content {
                    contentType(APPLICATION_JSON)
                    jsonPath("$.id") { exists() }
                    jsonPath("$.name") { value("test") }
                    jsonPath("$.url") { value("http://localhost:8080") }
                    jsonPath("$.apiKey") { doesNotExist() }
                }
            }
    }

    @Test
    fun `create agent with https url and api key should return 201`() {
        mockMvc.post("/api/v1/agents") {
            contentType = APPLICATION_JSON
            content = validHttpsAgent.let(objectMapper::writeValueAsString)
        }
            .andExpect {
                status {
                    isCreated()
                }
                content {
                    contentType(APPLICATION_JSON)
                    jsonPath("$.id") { exists() }
                    jsonPath("$.name") { value("test") }
                    jsonPath("$.url") { value("https://localhost:8080") }
                    jsonPath("$.apiKey") { value("test") }
                }
            }
            .andReturn()
    }

    @Test
    fun `create agent with invalid url should return 400`() {
        mockMvc.post("/api/v1/agents") {
            contentType = APPLICATION_JSON
            content = agentWithInvalidUrl.let(objectMapper::writeValueAsString)
        }
            .andExpect {
                status {
                    isBadRequest()
                }
            }
            .andReturn()
    }

    @Test
    fun `create agent with https url and no api key should return 400`() {
        mockMvc.post("/api/v1/agents") {
            contentType = APPLICATION_JSON
            content = validHttpsAgentWithoutApiKey.let(objectMapper::writeValueAsString)
        }
            .andExpect {
                status {
                    isBadRequest()
                }
            }
            .andReturn()
    }

    @Test
    fun `create agent with http url and api key should return 400`() {
        mockMvc.post("/api/v1/agents") {
            contentType = APPLICATION_JSON
            content = validHttpAgentWithApiKey.let(objectMapper::writeValueAsString)
        }
            .andExpect {
                status {
                    isBadRequest()
                }
            }
            .andReturn()
    }
}