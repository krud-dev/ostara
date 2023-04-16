package dev.krud.boost.daemon.controller.api.v1.application

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/applications/{applicationId}/abilities")
@Tag(name = "Instance Ability", description = "Application Ability API")
class ApplicationAbilityController(
    private val applicationService: ApplicationService
) {
    @GetMapping(produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get application abilities"
    )
    @ApiResponse(responseCode = "201", description = "Received abilities")
    @ApiResponse(responseCode = "404", description = "Application not found", content = [Content()])
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve application abilities", content = [Content()])
    fun getAbilities(@PathVariable applicationId: UUID): Set<InstanceAbility> {
        return applicationService.getAbilities(applicationId)
    }
}