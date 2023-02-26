package dev.krud.boost.daemon.controller

import dev.krud.boost.daemon.actuator.model.EnvActuatorResponse
import dev.krud.boost.daemon.configuration.instance.TestInstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.ability.TestInstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.systemproperties.InstanceSystemPropertiesService
import dev.krud.boost.daemon.util.persistAndGetInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureTestEntityManager
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.transaction.annotation.Transactional
import java.util.*

@TestPropertySource(locations = ["classpath:test.yml"])
@SpringBootTest
@AutoConfigureTestEntityManager
@AutoConfigureMockMvc
@TestInstanceActuatorClientProvider.Configure
@TestInstanceAbilityService.Configure
class InstanceSystemPropertiesControllerTest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var service: InstanceSystemPropertiesService

    @Autowired
    private lateinit var instanceActuatorClientProvider: TestInstanceActuatorClientProvider

    @Autowired
    private lateinit var instanceAbilityService: TestInstanceAbilityService

    @Autowired
    private lateinit var em: TestEntityManager

    private val baseUrlProvider: (instanceId: UUID) -> String = {
        "/api/v1/instances/$it/systemProperties"
    }

    @Test
    @Transactional
    fun `getSystemProperties should return bad request if instance is missing ability`() {
        val instance = em.persistAndGetInstance()
        instanceAbilityService.setAbilities(instance, InstanceAbility.except(InstanceAbility.SYSTEM_PROPERTIES))
        val baseUrl = baseUrlProvider(instance.id)
        mockMvc.perform(
            get(baseUrl)
        )
            .andExpect(status().isBadRequest)
    }

    @Test
    @Transactional
    fun `getSystemProperties should return not found if instance is not found`() {
        val baseUrl = baseUrlProvider(UUID.randomUUID())
        mockMvc.perform(
            get(baseUrl)
        )
            .andExpect(status().isNotFound)
    }

    @Test
    @Transactional
    fun `getSystemProperties should return ok if instance is found`() {
        val instance = em.persistAndGetInstance()
        val client = instanceActuatorClientProvider.provide(instance.id)
        whenever(client.env())
            .thenReturn(
                Result.success(
                    EnvActuatorResponse(
                        activeProfiles = emptySet(),
                        propertySources = listOf(
                            EnvActuatorResponse.PropertySource(
                                name = "systemProperties",
                                properties = mapOf(
                                    "test.value" to EnvActuatorResponse.PropertySource.Property(
                                        value = "test",
                                        origin = "test"
                                    )
                                )
                            )
                        )
                    )
                )
            )
        instanceAbilityService.setAbilities(instance)
        val baseUrl = baseUrlProvider(instance.id)
        mockMvc.perform(
            get(baseUrl)
        )
            .andExpect(status().isOk)
            .andExpect(jsonPath("\$.properties['test.value']").value("test"))
    }
}