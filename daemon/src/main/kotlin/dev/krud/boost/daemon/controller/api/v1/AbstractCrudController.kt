package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import jakarta.validation.ConstraintViolationException
import jakarta.validation.Valid
import jakarta.validation.Validator
import jakarta.validation.constraints.NotEmpty
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException
import java.util.*
import kotlin.reflect.KClass

@ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
abstract class AbstractCrudController<Entity : AbstractEntity, RO : Any, CreateDTO : Any, UpdateDTO : Any>(
    private val entityClazz: KClass<Entity>,
    private val roClazz: KClass<RO>,
    private val shapeShift: ShapeShift,
    private val krud: Krud<Entity, UUID>,
) : AbstractReadOnlyCrudController<Entity, RO>(entityClazz, roClazz, shapeShift, krud) {
    @Autowired
    private lateinit var validator: Validator
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
        return shapeShift.map(
            krud.create(
                shapeShift.map(dto, entityClazz.java),
                applyPolicies = true
            ),
            roClazz.java
        )
    }

    /**
     * Bulk create new resources
     */
    @PostMapping("/bulk", consumes = ["application/json"], produces = ["application/json"])
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create multiple resources",
        description = "Create multiple resources"
    )
    @ApiResponse(responseCode = "201", description = "Resources created")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun createMany(
        @RequestBody
        @Valid
        @NotEmpty
        request: BulkRequestRO<CreateDTO>
    ): List<RO> {
        request.items.forEach {
            val violations = validator.validate(it)
            if (violations.isNotEmpty()) {
                val e = ConstraintViolationException(violations)
                throw ResponseStatusException(
                    HttpStatus.BAD_REQUEST, e.message, e
                )
            }
        } // TODO: temp since validation does not seem to apply otherwise, conform with Spring's validation response type
        val result = krud.bulkCreate(
            shapeShift.mapCollection(request.items, entityClazz.java),
            applyPolicies = true
        )

        return shapeShift.mapCollection(result, roClazz.java)
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
        return shapeShift.map(
            krud.updateById(id = id, applyPolicies = true) {
                shapeShift.map(dto, this)
            },
            roClazz.java
        )
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
        krud.deleteById(id, applyPolicies = true)
    }

    data class BulkRequestRO<T>(
        val items: List<T>
    )
}