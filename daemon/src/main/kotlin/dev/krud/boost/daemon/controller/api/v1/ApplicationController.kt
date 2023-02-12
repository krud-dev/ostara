package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.ro.ApplicationModifyRequestRO
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/applications")
@Tag(name = "Application", description = "Application API")
class ApplicationController(
    private val crudHandler: CrudHandler,
    private val applicationService: ApplicationService,
    private val shapeShift: ShapeShift
) : AbstractCrudController<Application, ApplicationRO, ApplicationModifyRequestRO, ApplicationModifyRequestRO>(Application::class, ApplicationRO::class, crudHandler) {
    @PostMapping("/{applicationId}/move")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Move an application to a new folder",
        description = "Move an application to a new folder or root if no folder is specified"
    )
    @ApiResponse(responseCode = "200", description = "Move operation")
    @ApiResponse(responseCode = "404", description = "Application not found")
    @ApiResponse(responseCode = "503", description = "Folder invalid")
    fun moveApplication(@PathVariable applicationId: UUID, @RequestParam(required = false) newParentFolderId: UUID? = null): ApplicationRO {
        val application = applicationService.moveApplication(applicationId, newParentFolderId)
        return shapeShift.map(application)
    }
}