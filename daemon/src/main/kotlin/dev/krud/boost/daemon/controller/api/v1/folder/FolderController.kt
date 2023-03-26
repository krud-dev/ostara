package dev.krud.boost.daemon.controller.api.v1.folder

import dev.krud.boost.daemon.configuration.folder.FolderService
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.ro.FolderModifyRequestRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.configuration.folder.validation.ValidFolderIdOrNull
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import dev.krud.boost.daemon.controller.api.v1.AbstractCrudController
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/folders")
@Tag(name = "Folder", description = "Folder API")
class FolderController(
    private val folderKrud: Krud<Folder, UUID>,
    private val folderService: FolderService,
    private val shapeShift: ShapeShift
) : AbstractCrudController<Folder, FolderRO, FolderModifyRequestRO, FolderModifyRequestRO>(Folder::class, FolderRO::class, shapeShift, folderKrud) {
    @PostMapping("/{folderId}/move")
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Move a folder to a new parent folder",
        description = "Move a folder to a new parent folder or root if no folder is specified"
    )
    @ApiResponse(responseCode = "200", description = "Move operation")
    @ApiResponse(responseCode = "404", description = "Folder not found")
    @ApiResponse(responseCode = "503", description = "Folder invalid")
    fun moveFolder(@PathVariable folderId: UUID, @RequestParam(required = false) @Valid @ValidFolderIdOrNull newParentFolderId: UUID? = null, @RequestParam(required = false) newSort: Double? = null): FolderRO {
        val folder = folderService.moveFolder(folderId, newParentFolderId, newSort)
        return shapeShift.map(folder)
    }
}