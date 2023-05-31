package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.BackupDTO.Companion.toTreeElement
import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.backup.migration.BackupMigration.Companion.getLatestVersion
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.utils.searchSequence
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.stereotype.Component
import java.util.*

@Component
class BackupExporter(
    private val backupMigrations: List<BackupMigration>,
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceKrud: Krud<Instance, UUID>,
) {
    fun exportCurrentConfiguration(): BackupDTO {
        val rootFolders = getFolders()
            .map {
                buildFolderTreeElement(it)
            }
        val rootApplications = getApplications()
            .map {
                buildApplicationTreeElement(it)
            }
        return BackupDTO(
            version = backupMigrations.getLatestVersion(),
            tree = (rootFolders + rootApplications).toList()
        )

    }

    private fun buildFolderTreeElement(folder: Folder): BackupDTO.TreeElement.Folder {
        val treeElement = folder.toTreeElement()
            .apply {
                children = getFolders(folder.id)
                    .map { buildFolderTreeElement(it) }
                    .toList() + getApplications(folder.id)
                    .map { buildApplicationTreeElement(it) }
                    .toList()
            }
        return treeElement
    }

    private fun buildApplicationTreeElement(application: Application): BackupDTO.TreeElement.Application {
        val treeElement = application.toTreeElement()
            .apply {
                children = application.getInstances()
                    .map { buildInstanceTreeElement(it) }
                    .toList()
            }
        return treeElement
    }

    private fun buildInstanceTreeElement(instance: Instance): BackupDTO.TreeElement.Application.Instance {
        return instance.toTreeElement()
    }

    private fun getFolders(parentFolderId: UUID? = null) = folderKrud.searchSequence {
        if (parentFolderId == null) {
            Folder::parentFolderId.isNull()
        } else {
            Folder::parentFolderId Equal parentFolderId
        }
    }

    private fun getApplications(parentFolderId: UUID? = null) = applicationKrud.searchSequence {
        if (parentFolderId == null) {
            Application::parentFolderId.isNull()
        } else {
            Application::parentFolderId Equal parentFolderId
        }
    }

    private fun Application.getInstances(): Sequence<Instance> = instanceKrud.searchSequence {
        Instance::parentApplicationId Equal id
    }
}