package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.data.InstanceDataService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/instances/{instanceId}/data")
@Tag(name = "Instance Data", description = "Instance Data API")
class InstanceDataController(
    private val instanceDataService: InstanceDataService
) {
    @GetMapping(produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Request instance active profiles"
    )
    @ApiResponse(responseCode = "201", description = "Received Active Profiles")
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    @ApiResponse(responseCode = "400", description = "Bad request or missing ability 'ENV'", content = [Content()])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve active profiles", content = [Content()])
    fun getActiveProfiles(@PathVariable instanceId: UUID): Set<String> {
        return instanceDataService.getActiveProfiles(instanceId)
    }
}