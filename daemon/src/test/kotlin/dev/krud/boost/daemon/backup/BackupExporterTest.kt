package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.stubFolder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import java.util.*

class BackupExporterTest {
    private val backupMigrations: List<BackupMigration> = listOf(
        object : BackupMigration {
            override val toVersion: Int = 1
        }
    )
    private val folderKrud: Krud<Folder, UUID> = TestKrud(Folder::class.java) { UUID.randomUUID() }
    private val applicationKrud: Krud<Application, UUID> = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud: Krud<Instance, UUID> = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val backupExporter = BackupExporter(
        backupMigrations,
        folderKrud,
        applicationKrud,
        instanceKrud
    )

    @Test
    fun `exportCurrentConfigurations happy flow`() {
        val rootFolder1 = folderKrud.create(stubFolder(alias = "rootFolder1")).apply {
            folderKrud.create(stubFolder(alias = "rootFolder1_1", parentFolderId = this.id))
            folderKrud.create(stubFolder(alias = "rootFolder1_2", parentFolderId = this.id))
            applicationKrud.create(stubApplication(alias = "rootFolder1Application1", parentFolderId = this.id)).apply {
                instanceKrud.create(stubInstance(alias = "rootFolder1ApplicationInstance1", parentApplicationId = this.id))
                instanceKrud.create(stubInstance(alias = "rootFolder1ApplicationInstance2", parentApplicationId = this.id))
            }
        }
        val rootApplication1 = applicationKrud.create(stubApplication(alias = "rootApplication1")).apply {
            instanceKrud.create(stubInstance(alias = "rootApplicationInstance1", parentApplicationId = this.id))
            instanceKrud.create(stubInstance(alias = "rootApplicationInstance2", parentApplicationId = this.id))
        }
        val dto = backupExporter.exportCurrentConfiguration()

        // todo: assertions
    }
}