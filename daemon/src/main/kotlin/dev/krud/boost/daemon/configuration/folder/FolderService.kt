package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.stereotype.Service
import java.util.*

@Service
class FolderService(
    private val folderKrud: Krud<Folder, UUID>
) {
    fun getFolder(folderId: UUID): Folder? {
        return folderKrud.showById(folderId)
    }

    fun getFolderOrThrow(folderId: UUID): Folder {
        return getFolder(folderId) ?: throwNotFound("Folder $folderId not found")
    }

    fun moveFolder(folderId: UUID, newParentFolderId: UUID?, newSort: Double?): Folder {
        val folder = getFolderOrThrow(folderId)
        folder.parentFolderId = newParentFolderId // TODO: check if folder exists, should fail on foreign key for now
        folder.sort = newSort
        return folderKrud.update(folder)
    }
}