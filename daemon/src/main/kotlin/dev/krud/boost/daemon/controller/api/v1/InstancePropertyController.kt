package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.property.InstancePropertyService
import dev.krud.boost.daemon.configuration.instance.property.ro.InstancePropertyRO
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
@RequestMapping("$API_PREFIX/instances/{instanceId}/properties")
@Tag(name = "Instance Properties")
class InstancePropertyController(
    private val instancePropertyService: InstancePropertyService
) {

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get properties for an instance",
    )
    @ApiResponse(responseCode = "200", description = "Properties for an instance")
    @ApiResponse(responseCode = "400", description = "Instance is missing ability", content = [Content()])
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    fun getProperties(@PathVariable instanceId: UUID): InstancePropertyRO {
        return instancePropertyService.getProperties(instanceId)
    }
}