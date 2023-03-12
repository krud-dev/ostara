package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricService
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
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

@WebMvcTest(InstanceMetricController::class)
class InstanceMetricControllerTest {
    @MockBean
    private lateinit var instanceMetricService: InstanceMetricService

    @Autowired
    private lateinit var mockMvc: MockMvc

    private val baseUrlProvider: (instanceId: UUID) -> String = {
        "/api/v1/instances/$it/metrics"
    }

    @Test
    fun `get latest metrics happy flow`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceMetricService.getLatestMetric(instanceId, "test"))
            .thenReturn(
                InstanceMetricRO(
                    "test",
                    "description",
                    "bytes",
                    listOf(
                        InstanceMetricValueRO(
                            1.0,
                            Date(0L)
                        )
                    )
                )
            )
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("\$.name").value("test"))
            .andExpect(jsonPath("\$.description").value("description"))
            .andExpect(jsonPath("\$.unit").value("bytes"))
            .andExpect(jsonPath("\$.values").isArray)
            .andExpect(jsonPath("\$.values[0].value").value(1.0))
            .andExpect(jsonPath("\$.values[0].timestamp").value(0L))
    }

    @Test
    fun `get latest metrics instance not found should return 404`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceMetricService.getLatestMetric(instanceId, "test"))
            .then {
                throwNotFound()
            }
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `get latest metrics instance missing ability should return 400`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceMetricService.getLatestMetric(instanceId, "test"))
            .then {
                throwBadRequest()
            }
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isBadRequest)
    }
}