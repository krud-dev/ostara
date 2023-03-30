package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.base.crud.ro.CountResultRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.modelfilter.DynamicModelFilter
import dev.krud.crudframework.ro.PagedResult
import dev.krud.crudframework.ro.PagedResult.Companion.mapResults
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.reflect.KClass

abstract class AbstractReadOnlyCrudController<Entity : AbstractEntity, RO : Any>(
    private val entityClazz: KClass<Entity>,
    private val roClazz: KClass<RO>,
    private val shapeShift: ShapeShift,
    private val krud: Krud<Entity, UUID>
) {
    /**
     * Get a list of resources
     */
    @PostMapping("/search", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a list of resources",
        description = "Get a list of resources"
    )
    @ApiResponse(responseCode = "200", description = "List operation")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun search(
        @Valid @RequestBody
        filter: DynamicModelFilter
    ): PagedResult<RO> {
        return krud.searchByFilter(filter, applyPolicies = true)
            .mapResults { shapeShift.map(it, roClazz.java) }
    }

    @PostMapping("/search/count", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a count of resources",
        description = "Get a count of resources"
    )
    @ApiResponse(responseCode = "200", description = "Count operation")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun count(
        @Valid @RequestBody
        filter: DynamicModelFilter
    ): CountResultRO {
        val count = krud.searchByFilterCount(filter, applyPolicies = true)
        return CountResultRO(count)
    }

    /**
     * Get a single resource
     */
    @GetMapping("/{id}", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a single resource",
        description = "Get a single resource"
    )
    @ApiResponse(responseCode = "200", description = "Got resource")
    @ApiResponse(responseCode = "404", description = "Resource not found", content = [Content()])
    fun show(@PathVariable id: UUID): RO {
        return shapeShift.map(
            krud.showById(id, applyPolicies = true) ?: throwNotFound("${entityClazz.simpleName} with id $id not found"),
            roClazz.java
        )
    }
}