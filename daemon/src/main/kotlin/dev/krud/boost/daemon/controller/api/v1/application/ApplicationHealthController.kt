package dev.krud.boost.daemon.controller.api.v1.application

import dev.krud.boost.daemon.configuration.application.ApplicationHealthService
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("$API_PREFIX/applications/health")
@Tag(name = "Application Health")
class ApplicationHealthController(
    private val applicationHealthService: ApplicationHealthService
) {
    @GetMapping("/allCached", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get all application healths from cache, results may be partial"
    )
    @ApiResponse(responseCode = "200", description = "Received all applicationhealth")
    fun getAllApplicationHealthsFromCache(): Map<UUID, ApplicationHealthRO> {
        return applicationHealthService.getAllApplicationHealthsFromCache()
    }
}