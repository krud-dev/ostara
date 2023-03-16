package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
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
@RequestMapping("$API_PREFIX/instances/{instanceId}/abilities")
@Tag(name = "Instance Ability", description = "Instance Ability API")
class InstanceAbilityController(
    private val instanceAbilityService: InstanceAbilityService
) {
    @GetMapping(produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get instance abilities"
    )
    @ApiResponse(responseCode = "201", description = "Received abilities")
    @ApiResponse(responseCode = "404", description = "Instance not found", content = [Content()])
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    @ApiResponse(responseCode = "500", description = "Failed to retrieve instance abilities", content = [Content()])
    fun getAbilities(@PathVariable instanceId: UUID): Set<InstanceAbility> {
        return instanceAbilityService.getAbilities(instanceId)
    }
}