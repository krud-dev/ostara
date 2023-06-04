package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.migration.BackupMigration
import dev.krud.boost.daemon.backup.migration.BackupMigration.Companion.getLatestVersion
import dev.krud.boost.daemon.util.FileUtils
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import strikt.api.expect
import strikt.api.expectThat
import strikt.assertions.hasSize
import strikt.assertions.isEmpty
import strikt.assertions.isEqualTo

class BackupParserTest {
    @Test
    fun `parse backup version sanity`() {
        val backupParser = BackupParser(emptyList())
        val backup = """
            {
                "version": 1,
                "tree": []
            }
        """.trimIndent()
        val parsedBackup = backupParser.parse(backup)
        expectThat(parsedBackup.version).isEqualTo(1)
        expectThat(parsedBackup.tree).isEmpty()
    }

    @Test
    fun `parse backup of a version 0 backup should return a version 1 dto`() {
        val backupParser = BackupParser(
            listOf(
                object : BackupMigration {
                    override val toVersion = 1
                }
            )
        )
        val backup = """
            {
                "version": 0,
                "tree": []
            }
        """.trimIndent()
        val parsedBackup = backupParser.parse(backup)
        expectThat(parsedBackup.version).isEqualTo(1)
    }

    @SpringBootTest
    class BackupParserVersionSpringTests {
        @Autowired
        private lateinit var backupParser: BackupParser

        @Autowired
        private lateinit var backupMigrations: List<BackupMigration>

        @Test
        fun `version 1 backup should be parsed and migrated successfully`() {
            val latestVersion = backupMigrations.getLatestVersion()
            val json = FileUtils.loadJson("backup_snapshots/v1.json") ?: error("v1.json not found")
            val parsedBackup = backupParser.parse(json)
            expect {
                that(parsedBackup.version).isEqualTo(latestVersion)
                val flywayApp = parsedBackup.tree.first() as BackupDTO.TreeElement.Application
                that(flywayApp.type).isEqualTo("application")
                // region flywayApp
                flywayApp.validate(
                    alias = "Flyway",
                    description = null,
                    type = "SPRING_BOOT",
                    color = "inherited",
                    icon = null,
                    sort = 1.0,
                    authenticationProperties = mapOf("type" to "inherit"),
                    disableSslVerification = false
                )
                that(flywayApp.children).hasSize(3)
                flywayApp.children[0].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/first/1/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 1.0
                )
                flywayApp.children[1].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/first/2/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 2.0
                )
                flywayApp.children[2].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/first/3/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 3.0
                )
                // endregion
                // region secondApp
                val liquibaseApp = parsedBackup.tree[1] as BackupDTO.TreeElement.Application
                liquibaseApp.validate(
                    alias = "Liquibase",
                    description = null,
                    type = "SPRING_BOOT",
                    color = "inherited",
                    icon = null,
                    sort = 2.0,
                    authenticationProperties = mapOf("type" to "inherit"),
                    disableSslVerification = false
                )
                that(liquibaseApp.children).hasSize(3)
                liquibaseApp.children[0].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/second/1/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 1.0
                )
                liquibaseApp.children[1].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/second/2/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 2.0
                )
                liquibaseApp.children[2].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/second/3/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 3.0
                )
                // endregion
                // region secureApp
                val secureApp = parsedBackup.tree[2] as BackupDTO.TreeElement.Application
                secureApp.validate(
                    alias = "Secure",
                    description = null,
                    type = "SPRING_BOOT",
                    color = "inherited",
                    icon = null,
                    sort = 3.0,
                    authenticationProperties = mapOf("type" to "basic", "username" to "user", "password" to "user"),
                    disableSslVerification = false
                )
                that(secureApp.children).hasSize(3)
                secureApp.children[0].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/third/1/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 1.0
                )
                secureApp.children[1].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/third/2/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 2.0
                )
                secureApp.children[2].validate(
                    alias = null,
                    actuatorUrl = "https://sbclient.krud.dev/third/3/actuator",
                    description = null,
                    color = "inherited",
                    icon = null,
                    sort = 3.0
                )
                // endregion
            }
        }

        fun BackupDTO.TreeElement.Application.validate(
            alias: String,
            description: String?,
            type: String,
            color: String,
            icon: String?,
            sort: Double,
            authenticationProperties: Map<String, String>,
            disableSslVerification: Boolean
        ) {
            expect {
                that(this@validate.type).isEqualTo("application")
                model.apply {
                    that(this.alias).isEqualTo(alias)
                    that(this.description).isEqualTo(description)
                    that(this.type).isEqualTo(type)
                    that(this.color).isEqualTo(color)
                    that(this.icon).isEqualTo(icon)
                    that(this.sort).isEqualTo(sort)
                    that(this.authenticationProperties).isEqualTo(authenticationProperties)
                    that(this.disableSslVerification).isEqualTo(disableSslVerification)
                }
            }
        }

        fun BackupDTO.TreeElement.Application.Instance.validate(
            alias: String?,
            actuatorUrl: String,
            description: String?,
            color: String,
            icon: String?,
            sort: Double
        ) {
            expect {
                that(this@validate.type).isEqualTo("instance")
                model.apply {
                    that(this.alias).isEqualTo(alias)
                    that(this.actuatorUrl).isEqualTo(actuatorUrl)
                    that(this.description).isEqualTo(description)
                    that(this.color).isEqualTo(color)
                    that(this.icon).isEqualTo(icon)
                    that(this.sort).isEqualTo(sort)
                }
            }
        }
    }
}