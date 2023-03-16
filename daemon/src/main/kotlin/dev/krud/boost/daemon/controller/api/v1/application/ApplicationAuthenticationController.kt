package dev.krud.boost.daemon.controller.api.v1.application

import dev.krud.boost.daemon.configuration.application.authentication.ApplicationAuthenticationService
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/applications/{applicationId}/authentication")
@Tag(name = "Application Authentication", description = "Application Authentication API")
class ApplicationAuthenticationController(
    private val applicationAuthenticationService: ApplicationAuthenticationService
) {
    @GetMapping("/effective", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get instance effective authentication"
    )
    @ApiResponse(responseCode = "201", description = "Received effective authentication")
    @ApiResponse(responseCode = "404", description = "Application not found", content = [Content()])
    fun getEffectiveAuthentication(@PathVariable applicationId: UUID): EffectiveAuthentication {
        return applicationAuthenticationService.getEffectiveAuthentication(applicationId)
    }
}