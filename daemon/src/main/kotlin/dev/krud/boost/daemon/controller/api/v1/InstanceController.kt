package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.model.InstanceHealthLog
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro.InstanceHealthLogRO
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceModifyRequestRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.modelfilter.dsl.filter
import dev.krud.crudframework.modelfilter.dsl.where
import dev.krud.crudframework.ro.PagedResult
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/instances")
@Tag(name = "Instance", description = "Instance API")
class InstanceController(
    private val crudHandler: CrudHandler,
    private val shapeShift: ShapeShift,
    private val instanceService: InstanceService,
    private val instanceHealthService: InstanceHealthService
) : AbstractCrudController<Instance, InstanceRO, InstanceModifyRequestRO, InstanceModifyRequestRO>(Instance::class, InstanceRO::class, crudHandler) {
    @PostMapping("/{instanceId}/move")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Move an instance to a new application",
        description = "Move an instance to a new application"
    )
    @ApiResponse(responseCode = "200", description = "Move operation")
    @ApiResponse(responseCode = "404", description = "Instance or application not found")
    fun moveInstance(@PathVariable instanceId: UUID, @RequestParam newParentApplicationId: UUID, @RequestParam(required = false) newSort: Double? = null): InstanceRO {
        val instance = instanceService.moveInstance(instanceId, newParentApplicationId, newSort)
        return shapeShift.map(instance)
    }

    @PostMapping("/{instanceId}/health/live")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get the live health of the instance",
        description = "Get the live health of the instance"
    )
    @ApiResponse(responseCode = "200", description = "Live health")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getLiveHealth(@PathVariable instanceId: UUID): InstanceHealthRO {
        return instanceHealthService.getLiveHealth(instanceId)
    }

    @PostMapping("/{instanceId}/health/history")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get the historical health of the instance",
        description = "Get the historical health of the instance"
    )
    @ApiResponse(responseCode = "200", description = "Health history")
    @ApiResponse(responseCode = "404", description = "Instance not found")
    fun getHealthHistory(@PathVariable instanceId: UUID): List<InstanceHealthLogRO> {
        //TODO: fix filter
        return crudHandler
            .index(filter<InstanceHealthLog> {
                where {
//                InstanceHealthLog::instanceId eq
                }
                order {
                    by = InstanceHealthLog::creationTime
                    descending
                }
            }, InstanceHealthLog::class.java, InstanceHealthLogRO::class.java)
            .execute()
            .results
            .filter { it.instanceId == instanceId }
    }
}