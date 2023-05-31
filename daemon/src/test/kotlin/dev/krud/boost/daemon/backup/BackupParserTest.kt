package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.migration.BackupMigration
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class BackupParserTest {
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
}