package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.stubFolder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.test.TestKrud
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo
import java.util.*

class BackupExporterTest {
    private val backupMigrations: List<BackupMigration> = listOf(
        object : BackupMigration {
            override val toVersion: Int = 1
        }
    )
    private val folderKrud = TestKrud(Folder::class.java) { UUID.randomUUID() }
    private val applicationKrud = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val backupExporter = BackupExporter(
        backupMigrations,
        folderKrud,
        applicationKrud,
        instanceKrud
    )

    @Test
    fun `exportCurrentConfigurations happy flow`() {
        folderKrud.create(stubFolder(alias = "rootFolder1")).apply {
            folderKrud.create(stubFolder(alias = "rootFolder1_1", parentFolderId = this.id))
            applicationKrud.create(stubApplication(alias = "rootFolder1_1Application1", parentFolderId = this.id, authentication = Authentication.Basic("test", "test"))).apply {
                instanceKrud.create(stubInstance(alias = "rootFolder1_1Application1Instance1", parentApplicationId = this.id))
            }
        }
        val dto = backupExporter.exportAll()
        expect {
            that(dto.version).isEqualTo(1)
            that(dto.tree).hasSize(1)
            that(dto.tree[0].type).isEqualTo("folder")
            val rootFolder = dto.tree[0] as BackupDTO.TreeElement.Folder
            that(rootFolder.model.alias).isEqualTo("rootFolder1")
            that(rootFolder.children).hasSize(2)
            that(rootFolder.children[0].type).isEqualTo("folder")
            that(rootFolder.children[1].type).isEqualTo("application")
            val application = rootFolder.children[1] as BackupDTO.TreeElement.Application
            that(application.model.alias).isEqualTo("rootFolder1_1Application1")
            that(application.model.authenticationProperties).isEqualTo(
                mapOf(
                    "type" to "basic",
                    "username" to "test",
                    "password" to "test"
                )
            )
            that(application.children).hasSize(1)
            that(application.children[0].type).isEqualTo("instance")
            val instance = application.children[0] as BackupDTO.TreeElement.Application.Instance
            that(instance.model.alias).isEqualTo("rootFolder1_1Application1Instance1")
        }
    }
}