package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.data.InstanceDataService
import dev.krud.boost.daemon.configuration.instance.data.ro.InstanceDisplayNameRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
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
    @GetMapping("/activeProfiles", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get instance active profiles"
    )
    @ApiResponse(responseCode = "201", description = "Received Active Profiles")
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    @ApiResponse(responseCode = "400", description = "Bad request or missing ability 'ENV'", content = [Content()])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve active profiles", content = [Content()])
    fun getActiveProfiles(@PathVariable instanceId: UUID): Set<String> {
        return instanceDataService.getActiveProfiles(instanceId)
    }

    @GetMapping("/displayName", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get instance display name"
    )
    @ApiResponse(responseCode = "201", description = "Received Display Name")
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve display name", content = [Content()])
    fun getDisplayName(@PathVariable instanceId: UUID): InstanceDisplayNameRO {
        return instanceDataService.getDisplayName(instanceId)
    }
}