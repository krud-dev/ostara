package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*
import kotlin.reflect.KProperty
import kotlin.reflect.KProperty1

@Component
class FolderPersistentHooks(
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>
) : DeleteHooks<UUID, Folder> {
    // Temp fix until crud deployment is fixed
    override fun onDelete(entity: Folder) {
        folderKrud.deleteByFilter {
            where {
                (Folder::parentFolderId as KProperty1<Folder, UUID>) Equal entity.id
            }
        }
        applicationKrud.deleteByFilter {
            where {
                (Application::parentFolderId as KProperty1<Application, UUID>) Equal entity.id
            }
        }
    }
}