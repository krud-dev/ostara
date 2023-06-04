package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.BackupDTO.Companion.toApplication
import dev.krud.boost.daemon.backup.BackupDTO.Companion.toFolder
import dev.krud.boost.daemon.backup.BackupDTO.Companion.toInstance
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Component
class BackupImporter(
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>
) {
    @Transactional(readOnly = false)
    fun import(backup: BackupDTO) {
        backup.tree.forEach {
            when (it) {
                is BackupDTO.TreeElement.Folder -> importFolder(it)
                is BackupDTO.TreeElement.Application -> importApplication(it)
            }
        }
    }

    private fun importFolder(element: BackupDTO.TreeElement.Folder, parentFolderId: UUID? = null): Folder {
        val folder = element.toFolder(parentFolderId)
        val createdFolder = folderKrud.create(folder)
        element.children.forEach {
            when (it) {
                is BackupDTO.TreeElement.Folder -> importFolder(it, createdFolder.id)
                is BackupDTO.TreeElement.Application -> importApplication(it, createdFolder.id)
            }
        }

        return folder
    }

    private fun importApplication(element: BackupDTO.TreeElement.Application, parentFolderId: UUID? = null): Application {
        val application = element.toApplication(parentFolderId)
        val createdApplication = applicationKrud.create(application)
        element.children.forEach {
            when (it) {
                is BackupDTO.TreeElement.Application.Instance -> {
                    importInstance(it, createdApplication.id)
                }
            }
        }

        return application
    }

    private fun importInstance(element: BackupDTO.TreeElement.Application.Instance, parentApplicationId: UUID): Instance {
        val instance = element.toInstance(parentApplicationId)
        return instanceKrud.create(instance)
    }
}