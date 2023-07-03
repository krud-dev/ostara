package dev.krud.boost.daemon.controller.api.v1.agent

import dev.krud.boost.daemon.configuration.agent.authentication.AgentAuthenticationService
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
@RequestMapping("$API_PREFIX/agents/{agentId}/authentication")
@Tag(name = "Agent Authentication", description = "Agent Authentication API")
class AgentAuthenticationController(
    private val agentAuthenticationService: AgentAuthenticationService
) {
    @GetMapping("/effective", produces = ["agent/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get agent effective authentication"
    )
    @ApiResponse(responseCode = "201", description = "Received effective authentication")
    @ApiResponse(responseCode = "404", description = "Agent not found", content = [Content()])
    fun getEffectiveAuthentication(@PathVariable agentId: UUID): EffectiveAuthentication {
        return agentAuthenticationService.getEffectiveAuthentication(agentId)
    }
}