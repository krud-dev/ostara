package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.stereotype.Service
import java.util.*

@Service
class FolderService(
    private val crudHandler: CrudHandler
) {
    fun getFolder(folderId: UUID): Folder? {
        return crudHandler
            .show(folderId, Folder::class.java)
            .execute()
    }

    fun getFolderOrThrow(folderId: UUID): Folder {
        return getFolder(folderId) ?: error("Folder $folderId not found")
    }

    fun moveFolder(folderId: UUID, newParentFolderId: UUID?): Folder {
        val folder = getFolderOrThrow(folderId)
        if (folder.parentFolderId == newParentFolderId) {
            return folder
        }
        folder.parentFolderId = newParentFolderId // TODO: check if folder exists, should fail on foreign key for now
        return crudHandler
            .update(folder, Folder::class.java)
            .execute()
    }
}