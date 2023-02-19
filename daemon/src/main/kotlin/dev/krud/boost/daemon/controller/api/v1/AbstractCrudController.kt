package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.crudframework.crud.handler.CrudHandler
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*
import kotlin.reflect.KClass

abstract class AbstractCrudController<Entity : AbstractEntity, RO : Any, CreateDTO, UpdateDTO>(
    private val entityClazz: KClass<Entity>,
    private val roClazz: KClass<RO>,
    private val crudHandler: CrudHandler
) : AbstractReadOnlyCrudController<Entity, RO>(entityClazz, roClazz, crudHandler) {
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
    fun create(
        @Valid @RequestBody
        dto: CreateDTO
    ): RO {
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
    fun update(@PathVariable id: UUID, @Valid @RequestBody dto: UpdateDTO): RO {
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
}