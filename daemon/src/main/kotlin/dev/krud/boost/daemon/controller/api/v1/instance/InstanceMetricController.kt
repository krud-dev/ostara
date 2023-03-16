package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.metric.InstanceMetricService
import dev.krud.boost.daemon.configuration.instance.metric.ro.InstanceMetricRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/instances/{instanceId}/metrics")
@ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
@Tag(name = "Instance Metrics")
class InstanceMetricController(
    private val instanceMetricService: InstanceMetricService
) {
    @GetMapping("/latest")
    @ResponseStatus(HttpStatus.OK)
    @ApiResponse(responseCode = "200", description = "Latest metrics for an instance")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    fun getLatestMetrics(@PathVariable instanceId: UUID, @RequestParam metricName: String): InstanceMetricRO {
        return instanceMetricService.getLatestMetric(instanceId, metricName)
    }
}