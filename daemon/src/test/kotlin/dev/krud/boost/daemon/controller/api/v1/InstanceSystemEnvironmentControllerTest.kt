package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.systemenvironment.InstanceSystemEnvironmentService
import dev.krud.boost.daemon.configuration.instance.systemenvironment.ro.InstanceSystemEnvironmentRO
import dev.krud.boost.daemon.controller.api.v1.instance.InstanceSystemEnvironmentController
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.util.*

@WebMvcTest(InstanceSystemEnvironmentController::class)
class InstanceSystemEnvironmentControllerTest {
    @MockBean
    private lateinit var instanceSystemEnvironmentService: InstanceSystemEnvironmentService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val baseUrlProvider: (instanceId: UUID) -> String = {
        "/api/v1/instances/$it/systemEnvironment"
    }

    @Test
    fun `get system environment happy flow`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceSystemEnvironmentService.getSystemEnvironment(instanceId))
            .thenReturn(
                InstanceSystemEnvironmentRO(
                    mapOf(
                        "test" to "test",
                        "test2" to "test2"
                    ),
                    InstanceSystemEnvironmentRO.RedactionLevel.NONE
                )
            )
        val baseUrl = baseUrlProvider(instanceId)
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("\$.properties").isMap)
            .andExpect(jsonPath("\$.properties.test").value("test"))
            .andExpect(jsonPath("\$.properties.test2").value("test2"))
            .andExpect(jsonPath("\$.redactionLevel").value("NONE"))
    }

    @Test
    fun `get system environment instance not found should return 404`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceSystemEnvironmentService.getSystemEnvironment(instanceId))
            .then {
                throwNotFound()
            }
        val baseUrl = baseUrlProvider(instanceId)
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `get system environment instance missing ability should return 400`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceSystemEnvironmentService.getSystemEnvironment(instanceId))
            .then {
                throwBadRequest()
            }
        val baseUrl = baseUrlProvider(instanceId)
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isBadRequest)
    }
}