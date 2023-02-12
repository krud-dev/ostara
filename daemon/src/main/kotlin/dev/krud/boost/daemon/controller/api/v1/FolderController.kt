package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.ro.FolderModifyRequestRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.crudframework.crud.handler.CrudHandler
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_PREFIX/folders")
@Tag(name = "Folder", description = "Folder API")
class FolderController(
    private val crudHandler: CrudHandler
) : AbstractCrudController<Folder, FolderRO, FolderModifyRequestRO, FolderModifyRequestRO>(Folder::class, FolderRO::class, crudHandler)