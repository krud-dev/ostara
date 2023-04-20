package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.InstanceHttpRequestStatisticsService
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.enums.HttpMethod
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.ro.InstanceHttpRequestStatisticsRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
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
@RequestMapping("$API_PREFIX/instances/{instanceId}/httpRequestStatistics")
@Tag(name = "Instance HTTP Request Statistics")
class InstanceHttpRequestStatisticsController(
    private val instanceHttpRequestStatisticsService: InstanceHttpRequestStatisticsService
) {
    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get HTTP request statistics for an instance",
        description = "Get HTTP request statistics for an instance"
    )
    @ApiResponse(responseCode = "200", description = "Get HTTP request statistics for an instance")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getStatistics(@PathVariable instanceId: UUID): List<InstanceHttpRequestStatisticsRO> {
        return instanceHttpRequestStatisticsService.getStatistics(instanceId)
    }

    @GetMapping("/methods")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get HTTP request statistics for an instance by URI split by methods"
    )
    @ApiResponse(responseCode = "200", description = "Get HTTP request statistics for an instance by URI split by methods")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getStatisticsByUriAndMethod(@PathVariable instanceId: UUID, @RequestParam uri: String): Map<HttpMethod, InstanceHttpRequestStatisticsRO> {
        return instanceHttpRequestStatisticsService.getStatisticsByUriAndMethod(instanceId, uri)
    }

    @GetMapping("/outcomes")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get HTTP request statistics for an instance by URI split by outcomes"
    )
    @ApiResponse(responseCode = "200", description = "Get HTTP request statistics for an instance by URI split by outcomes")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getStatisticsByUriAndOutcome(@PathVariable instanceId: UUID, @RequestParam uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return instanceHttpRequestStatisticsService.getStatisticsByUriAndOutcome(instanceId, uri)
    }

    @GetMapping("/statuses")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get HTTP request statistics for an instance by URI split by statuses"
    )
    @ApiResponse(responseCode = "200", description = "Get HTTP request statistics for an instance by URI split by statuses")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getStatisticsByUriAndStatus(@PathVariable instanceId: UUID, @RequestParam uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return instanceHttpRequestStatisticsService.getStatisticsByUriAndStatus(instanceId, uri)
    }

    @GetMapping("/exceptions")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get HTTP request statistics for an instance by URI split by exceptions"
    )
    @ApiResponse(responseCode = "200", description = "Get HTTP request statistics for an instance by URI split by exceptions")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getStatisticsByUriAndException(@PathVariable instanceId: UUID, @RequestParam uri: String): Map<String, InstanceHttpRequestStatisticsRO> {
        return instanceHttpRequestStatisticsService.getStatisticsByUriAndException(instanceId, uri)
    }
}