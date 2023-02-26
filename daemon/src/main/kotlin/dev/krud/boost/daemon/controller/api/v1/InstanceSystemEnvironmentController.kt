package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.systemenvironment.InstanceSystemEnvironmentService
import dev.krud.boost.daemon.configuration.instance.systemenvironment.ro.InstanceSystemEnvironmentRO
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
@RequestMapping("$API_PREFIX/instances/{instanceId}/systemEnvironment")
@Tag(name = "Instance System Environment")
class InstanceSystemEnvironmentController(
    private val instanceSystemEnvironmentService: InstanceSystemEnvironmentService
) {

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get system environment for an instance"
    )
    @ApiResponse(responseCode = "200", description = "Properties for an instance")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    fun getSystemProperties(@PathVariable instanceId: UUID): InstanceSystemEnvironmentRO {
        return instanceSystemEnvironmentService.getSystemEnvironment(instanceId)
    }
}