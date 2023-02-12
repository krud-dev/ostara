package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class FolderPersistentHooks(
    private val crudHandler: CrudHandler
) : DeleteHooks<UUID, Folder> {
    override fun onDelete(entity: Folder) {
        entity.applications.forEach {
            crudHandler.delete(it.id, Application::class.java).execute()
        }
        entity.folders.forEach {
            crudHandler.delete(it.id, Folder::class.java).execute()
        }
    }
}