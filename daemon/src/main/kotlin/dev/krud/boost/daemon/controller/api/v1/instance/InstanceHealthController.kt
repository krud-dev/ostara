package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("$API_PREFIX/instances/health")
@Tag(name = "Instance Health")
class InstanceHealthController(
    private val instanceHealthService: InstanceHealthService
) {
    @GetMapping("/allCached", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all instance healths from cache, results may be partial"
    )
    @ApiResponse(responseCode = "200", description = "Received all instance health")
    fun getAllInstanceHealthsFromCache(): Map<UUID, InstanceHealthRO> {
        return instanceHealthService.getAllInstanceHealthsFromCache()
    }

    @PutMapping("/update/{instanceId}", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update instance health and return it"
    )
    @ApiResponse(responseCode = "200", description = "Received instance health")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun updateInstanceHealth(@PathVariable instanceId: UUID): InstanceHealthRO {
        return instanceHealthService.updateInstanceHealthAndReturn(instanceId)
    }
}