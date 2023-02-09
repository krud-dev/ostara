package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.modelfilter.DynamicModelFilter
import dev.krud.crudframework.ro.PagedResult
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.reflect.KClass

abstract class AbstractCrudController<Entity : AbstractEntity, RO : Any, CreateDTO, UpdateDTO>(
    private val entityClazz: KClass<Entity>,
    private val roClazz: KClass<RO>,
    private val crudHandler: CrudHandler
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
    fun search(@RequestBody filter: DynamicModelFilter): PagedResult<RO> {
        return crudHandler
            .index(filter, entityClazz.java, roClazz.java)
            .applyPolicies()
            .execute()
    }

    @PostMapping("/search/count", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get a count of resources",
        description = "Get a count of resources"
    )
    @ApiResponse(responseCode = "200", description = "Count operation")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun count(@RequestBody filter: DynamicModelFilter): CountResultRO {
        val count = crudHandler
            .index(filter, entityClazz.java)
            .apply {
                applyPolicies()
            }
            .count()
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
        return crudHandler
            .show(id, entityClazz.java, roClazz.java)
            .applyPolicies()
            .execute()
    }

    /**
     * Create a new resource
     */
    @PostMapping(consumes = ["application/json"], produces = ["application/json"])
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create a resource",
        description = "Create a resource"
    )
    @ApiResponse(responseCode = "201", description = "Resource created")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun create(@RequestBody dto: CreateDTO): RO {
        return crudHandler
            .createFrom(dto, entityClazz.java, roClazz.java)
            .applyPolicies()
            .execute()
    }

    /**
     * Update an existing resource
     */
    @PutMapping("/{id}", consumes = ["application/json"], produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Update a resource",
        description = "Update a resource"
    )
    @ApiResponse(responseCode = "200", description = "Resource updated")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    @ApiResponse(responseCode = "404", description = "Resource not found", content = [Content()])
    fun update(@PathVariable id: UUID, @RequestBody dto: UpdateDTO): RO {
        return crudHandler
            .updateFrom(id, dto, entityClazz.java, roClazz.java)
            .applyPolicies()
            .execute()
    }

    /**
     * Delete an existing resource
     */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Delete a resource",
        description = "Delete a resource"
    )
    @ApiResponse(responseCode = "204", description = "Resource deleted", content = [Content()])
    @ApiResponse(responseCode = "404", description = "Resource not found", content = [Content()])
    fun delete(@PathVariable id: UUID) {
        crudHandler
            .delete(id, entityClazz.java)
            .applyPolicies()
            .execute()
    }

    data class CountResultRO(val total: Long)
}
