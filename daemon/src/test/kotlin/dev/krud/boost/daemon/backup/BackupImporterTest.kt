package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import java.util.*

class BackupImporterTest {
    private val folderKrud: Krud<Folder, UUID> = TestKrud(Folder::class.java) { UUID.randomUUID() }
    private val applicationKrud: Krud<Application, UUID> = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud: Krud<Instance, UUID> = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val backupImporter = BackupImporter(folderKrud, applicationKrud, instanceKrud)

    @Test
    fun `importBackup should recursively import a backupDTO`() {
        val dto = BackupDTO(
            1,
            listOf(
                BackupDTO.TreeElement.Folder(
                    BackupDTO.TreeElement.Folder.Model(
                        "rootFolder1",
                        null,
                        "red",
                        null,
                        null,
                        null
                    ),
                    children = listOf(

                    )
                ),
                BackupDTO.TreeElement.Folder(
                    BackupDTO.TreeElement.Folder.Model(
                        "rootFolder1_1",
                        "rootFolder1",
                        "red",
                        null,
                        null,
                        null
                    )
                ),
            )
        )
    }
}