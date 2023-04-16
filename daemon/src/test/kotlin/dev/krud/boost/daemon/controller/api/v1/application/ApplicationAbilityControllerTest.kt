package dev.krud.boost.daemon.controller.api.v1.application

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.util.*

@WebMvcTest(ApplicationAbilityController::class)
class ApplicationAbilityControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var applicationService: ApplicationService

    private val baseUrlProvider: (applicationId: UUID) -> String = {
        "/api/v1/applications/$it/abilities"
    }

    @Test
    fun `get application abilities happy flow`() {
        val applicationId = UUID.randomUUID()
        whenever(applicationService.getAbilities(applicationId))
            .thenReturn(
                setOf(
                    InstanceAbility.CACHES,
                    InstanceAbility.LOGGERS
                )
            )
        val baseUrl = baseUrlProvider(applicationId)
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
            .andExpect(MockMvcResultMatchers.jsonPath("\$[0]").value("CACHES"))
            .andExpect(MockMvcResultMatchers.jsonPath("\$[1]").value("LOGGERS"))
    }
}