package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.ro.BackupDTO
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.stubFolder
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.metricmonitor.rule.enums.ApplicationMetricRuleOperation
import dev.krud.boost.daemon.metricmonitor.rule.model.ApplicationMetricRule
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo
import java.util.*

class BackupImporterTest {
    private val folderKrud = TestKrud(Folder::class.java) { UUID.randomUUID() }
    private val applicationKrud = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val applicationMetricRuleKrud = TestKrud(ApplicationMetricRule::class.java) { UUID.randomUUID() }
    private val backupImporter = BackupImporter(folderKrud, applicationKrud, instanceKrud, applicationMetricRuleKrud)
    // region private val dto = ...
    private val dto = BackupDTO(
        version = 1,
        tree = listOf(
            BackupDTO.TreeElement.Folder(
                model = BackupDTO.TreeElement.Folder.Model(
                    "rootFolder1",
                    null,
                    "red",
                    "folder",
                    1.0,
                    null
                ),
                children = listOf(
                    BackupDTO.TreeElement.Application(
                        model = BackupDTO.TreeElement.Application.Model(
                            "rootFolder1Application1",
                            "some app description",
                            "SPRING_BOOT",
                            DEFAULT_COLOR,
                            "cloud",
                            1.0
                        ),
                        children = listOf(
                            BackupDTO.TreeElement.Application.Instance(
                                model = BackupDTO.TreeElement.Application.Instance.Model(
                                    "rootFolder1ApplicationInstance1",
                                    "http://localhost:8080",
                                    "some instance description",
                                    DEFAULT_COLOR,
                                    "gear",
                                    1.0
                                )
                            )
                        ),
                        metricRules = listOf(
                            BackupDTO.TreeElement.Application.MetricRule(
                                name = "rootFolder1Application1MetricRule1",
                                metricName = "test[VALUE]",
                                divisorMetricName = null,
                                operation = "GREATER_THAN",
                                value1 = 1.0,
                                value2 = null,
                                enabled = true,
                                type = "SIMPLE"
                            )
                        )
                    )
                )
            )
        ),
    )
    // endregion

    @Test
    fun `importBackup should recursively import a backupDTO`() {
        backupImporter.import(dto)
        validateDto()
    }

    @Test
    fun `deleteAndImport should delete all orphan folders, applications`() {
        folderKrud.create(stubFolder())
        applicationKrud.create(stubApplication())
        backupImporter.deleteAndImport(dto)
        validateDto()
    }

    private fun validateDto() {
        expect {
            that(folderKrud.entities).hasSize(1)
            that(applicationKrud.entities).hasSize(1)
            that(instanceKrud.entities).hasSize(1)
            that(applicationMetricRuleKrud.entities).hasSize(1)
            folderKrud.entities[0].apply {
                that(alias).isEqualTo("rootFolder1")
                that(parentFolderId).isEqualTo(null)
                that(color).isEqualTo("red")
                that(icon).isEqualTo("folder")
                that(sort).isEqualTo(1.0)
                that(description).isEqualTo(null)
            }
            applicationKrud.entities[0].apply {
                that(alias).isEqualTo("rootFolder1Application1")
                that(description).isEqualTo("some app description")
                that(type).isEqualTo(ApplicationType.SPRING_BOOT)
                that(color).isEqualTo(DEFAULT_COLOR)
                that(icon).isEqualTo("cloud")
                that(sort).isEqualTo(1.0)
                that(parentFolderId).isEqualTo(folderKrud.entities[0].id)
            }
            instanceKrud.entities[0].apply {
                that(alias).isEqualTo("rootFolder1ApplicationInstance1")
                that(description).isEqualTo("some instance description")
                that(actuatorUrl).isEqualTo("http://localhost:8080")
                that(color).isEqualTo(DEFAULT_COLOR)
                that(icon).isEqualTo("gear")
                that(sort).isEqualTo(1.0)
                that(parentApplicationId).isEqualTo(applicationKrud.entities[0].id)
            }
            applicationMetricRuleKrud.entities[0].apply {
                that(name).isEqualTo("rootFolder1Application1MetricRule1")
                that(metricName).isEqualTo("test[VALUE]")
                that(divisorMetricName).isEqualTo(null)
                that(operation).isEqualTo(ApplicationMetricRuleOperation.GREATER_THAN)
                that(value1).isEqualTo(1.0)
                that(value2).isEqualTo(null)
                that(enabled).isEqualTo(true)
                that(type).isEqualTo(ApplicationMetricRule.Type.SIMPLE)
                that(applicationId).isEqualTo(applicationKrud.entities[0].id)
            }
        }
    }
}