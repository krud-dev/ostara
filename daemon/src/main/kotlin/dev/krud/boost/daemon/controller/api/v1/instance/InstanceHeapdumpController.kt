package dev.krud.boost.daemon.controller.api.v1.instance

import dev.krud.boost.daemon.configuration.instance.heapdump.InstanceHeapdumpService
import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference
import dev.krud.boost.daemon.configuration.instance.heapdump.ro.InstanceHeapdumpReferenceRO
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import dev.krud.boost.daemon.controller.api.v1.AbstractReadOnlyCrudController
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.core.io.InputStreamResource
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/instances/heapdumps")
@Tag(name = "Instance Heapdump")
class InstanceHeapdumpController(
    private val crudHandler: CrudHandler,
    private val instanceHeapdumpService: InstanceHeapdumpService,
    private val shapeShift: ShapeShift,
    private val instanceHeapdumpReferenceKrud: Krud<InstanceHeapdumpReference, UUID>
) : AbstractReadOnlyCrudController<InstanceHeapdumpReference, InstanceHeapdumpReferenceRO>(
    InstanceHeapdumpReference::class,
    InstanceHeapdumpReferenceRO::class,
    shapeShift,
    instanceHeapdumpReferenceKrud
) {
    @PostMapping("/{instanceId}", produces = ["application/json"])
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Request a heapdump"
    )
    @ApiResponse(responseCode = "201", description = "Request created created")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun requestHeapdump(@PathVariable instanceId: UUID): InstanceHeapdumpReferenceRO {
        return instanceHeapdumpService.requestHeapdump(instanceId)
    }

    @GetMapping("/download/{referenceId}", produces = [MediaType.APPLICATION_OCTET_STREAM_VALUE])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Download a heapdump"
    )
    @ApiResponse(responseCode = "200", description = "Heapdump downloaded")
    @ApiResponse(responseCode = "400", description = "Bad request", content = [Content()])
    fun downloadHeapdump(@PathVariable referenceId: UUID): InputStreamResource {
        return InputStreamResource(
            instanceHeapdumpService.downloadHeapdump(referenceId)
        )
    }

    /**
     * Delete an existing heapdump
     */
    @DeleteMapping("/{referenceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Delete a heapdump"
    )
    @ApiResponse(responseCode = "204", description = "Heapdump deleted", content = [Content()])
    @ApiResponse(responseCode = "404", description = "Heapdump not found", content = [Content()])
    fun delete(@PathVariable referenceId: UUID) {
        instanceHeapdumpService.deleteHeapdump(referenceId)
    }
}