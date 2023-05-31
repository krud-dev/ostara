package dev.krud.boost.daemon.backup

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
    fun importBackup(backup: BackupDTO) {
        backup.tree.forEach {
            when (it) {
                is BackupDTO.TreeElement.Folder -> importFolder(it)
                is BackupDTO.TreeElement.Application -> importApplication(it)
            }
        }
    }

    private fun importFolder(element: BackupDTO.TreeElement.Folder): Folder {
        val folder = element.model.toFolder()
        folderKrud.save(folder)
        element.children.forEach {
            when (it) {
                is BackupDTO.TreeElement.Folder -> {
                    val childFolder = importFolder(it)
                    folderKrud.save(childFolder)
                }
                is BackupDTO.TreeElement.Application -> {
                    val childApplication = importApplication(it)
                    folderKrud.save(childApplication)
                }
            }
        }
        return folder
    }
}