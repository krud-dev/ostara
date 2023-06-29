package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.agent.AgentDiscoveryService
import dev.krud.boost.daemon.agent.AgentService
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.agent.model.AgentInfoDTO
import dev.krud.boost.daemon.agent.ro.AgentModifyRequestRO
import dev.krud.boost.daemon.agent.ro.AgentRO
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.folder.validation.ValidFolderIdOrNull
import dev.krud.boost.daemon.utils.ResultAggregationSummary
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/agents")
@Tag(name = "Agent", description = "Agent API")
class AgentController(
    private val agentService: AgentService,
    private val agentDiscoveryService: AgentDiscoveryService,
    private val shapeShift: ShapeShift,
    agentKrud: Krud<Agent, UUID>,
) : AbstractCrudController<Agent, AgentRO, AgentModifyRequestRO, AgentModifyRequestRO>(Agent::class, AgentRO::class, shapeShift, agentKrud) {
    @GetMapping("/{agentId}/info", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get agent info"
    )
    @ApiResponse(responseCode = "200", description = "Agent info")
    @ApiResponse(responseCode = "404", description = "Agent not found")
    fun getAgentInfo(@PathVariable agentId: UUID): AgentInfoDTO {
        return agentService.getAgentInfo(agentId).getOrThrow()
    }

    @PostMapping("/runDiscovery", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Run an instance discovery for all agents"
    )
    @ApiResponse(responseCode = "200", description = "Ran instance discovery")
    fun runDiscovery(): ResultAggregationSummary<Unit> {
        return agentDiscoveryService.runDiscovery()
    }

    @PostMapping("/runDiscoveryForAgent", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Run an instance discovery for a specific agent"
    )
    @ApiResponse(responseCode = "200", description = "Ran instance discovery")
    fun runDiscoveryForAgent(@RequestParam agentId: UUID) {
        agentDiscoveryService.runDiscoveryForAgent(agentId).getOrThrow()
    }

    @PostMapping("/{agentId}/move")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Move an application to a new folder",
        description = "Move an application to a new folder or root if no folder is specified"
    )
    @ApiResponse(responseCode = "200", description = "Move operation")
    @ApiResponse(responseCode = "404", description = "Application not found")
    @ApiResponse(responseCode = "503", description = "Folder invalid")
    fun moveAgent(@PathVariable agentId: UUID, @RequestParam(required = false) @Valid @ValidFolderIdOrNull newParentFolderId: UUID? = null, @RequestParam(required = false) newSort: Double? = null): ApplicationRO {
        val application = agentService.moveAgent(agentId, newParentFolderId, newSort)
        return shapeShift.map(application)
    }
}