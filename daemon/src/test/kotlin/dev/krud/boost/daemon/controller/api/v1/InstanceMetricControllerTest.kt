package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricService
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricValueRO
import dev.krud.boost.daemon.controller.api.v1.instance.InstanceMetricController
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.utils.ParsedMetricName
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
        whenever(instanceMetricService.getLatestMetric(instanceId, ParsedMetricName.from("test[VALUE]")))
            .thenReturn(
                InstanceMetricRO(
                    "test[VALUE]",
                    "description",
                    "bytes",
                    InstanceMetricValueRO(
                        1.0,
                        Date(0L)
                    )
                )
            )
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test[VALUE]"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isOk)
            .andExpect(content().contentType("application/json"))
            .andExpect(jsonPath("\$.name").value("test[VALUE]"))
            .andExpect(jsonPath("\$.description").value("description"))
            .andExpect(jsonPath("\$.unit").value("bytes"))
            .andExpect(jsonPath("\$.value.value").value(1.0))
            .andExpect(jsonPath("\$.value.timestamp").value(0L))
    }

    @Test
    fun `get latest metrics instance not found should return 404`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceMetricService.getLatestMetric(instanceId, ParsedMetricName.from("test[VALUE]")))
            .then {
                throwNotFound()
            }
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test[VALUE]"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isNotFound)
    }

    @Test
    fun `get latest metrics instance missing ability should return 400`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceMetricService.getLatestMetric(instanceId, ParsedMetricName.from("test[VALUE]")))
            .then {
                throwBadRequest()
            }
        val baseUrl = baseUrlProvider(instanceId) + "/latest?metricName=test[VALUE]"
        mockMvc.perform(
            MockMvcRequestBuilders.get(baseUrl)
        )
            .andExpect(status().isBadRequest)
    }
}