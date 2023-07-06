package dev.krud.boost.daemon.backup.migration

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import strikt.api.expectThat
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo

class BackupMigrationTest {
    private val objectMapper = ObjectMapper().apply {
        registerModule(kotlinModule())
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    }
    @Test
    fun `Version 1 migrator should change the version number to 1`() {
        val input = objectMapper.readTree("""
            {
                "version": 0,
                "tree": []
            }
        """.trimIndent())
        Version1BackupMigration().migrate(input as ObjectNode)
        expectThat(input.get("version").asInt()).isEqualTo(1)
    }

    @Test
    fun `version 2 migrator should add a 0 date to the backup`() {
        val input = objectMapper.readTree("""
            {
                "version": 1,
                "tree": []
            }
        """.trimIndent())
        Version2BackupMigration().migrate(input as ObjectNode)
        expectThat(input.get("date").asInt()).isEqualTo(0)
    }

    @SpringBootTest
    @ActiveProfiles("test")
    class BackupMigrationSpringTest {
        @Autowired
        private lateinit var backupMigrations: List<BackupMigration>

        @Test
        fun `all migrations should have unique versions`() {
            val versions = backupMigrations.map { it.toVersion }
            expectThat(versions).hasSize(versions.toSet().size)
        }
    }
}