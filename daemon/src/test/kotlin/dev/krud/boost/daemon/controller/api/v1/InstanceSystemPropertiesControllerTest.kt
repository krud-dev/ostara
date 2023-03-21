package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.systemproperties.InstanceSystemPropertiesService
import dev.krud.boost.daemon.configuration.instance.systemproperties.ro.InstanceSystemPropertiesRO
import dev.krud.boost.daemon.controller.api.v1.instance.InstanceSystemPropertiesController
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

@WebMvcTest(InstanceSystemPropertiesController::class)
class InstanceSystemPropertiesControllerTest {
    @MockBean
    private lateinit var instanceSystemPropertiesService: InstanceSystemPropertiesService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val baseUrlProvider: (instanceId: UUID) -> String = {
        "/api/v1/instances/$it/systemProperties"
    }

    @Test
    fun `get system environment happy flow`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceSystemPropertiesService.getSystemProperties(instanceId))
            .thenReturn(
                InstanceSystemPropertiesRO(
                    mapOf(
                        "test" to "test",
                        "test2" to "test2"
                    ),
                    InstanceSystemPropertiesRO.RedactionLevel.NONE
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
        whenever(instanceSystemPropertiesService.getSystemProperties(instanceId))
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
        whenever(instanceSystemPropertiesService.getSystemProperties(instanceId))
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