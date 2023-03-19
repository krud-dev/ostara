package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class FolderPersistentHooks(
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>
) : DeleteHooks<UUID, Folder> {
    override fun onDelete(entity: Folder) {
        folderKrud.deleteByFilter {
            where {
                Folder::parentFolderId Equal entity.id
            }
        }
        applicationKrud.deleteByFilter {
            where {
                Application::parentFolderId Equal entity.id
            }
        }
    }
}