package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.kotlinModule
import org.springframework.stereotype.Service

@Service
class BackupService(
    private val backupExporter: BackupExporter,
    private val backupParser: BackupParser,
    private val backupImporter: BackupImporter
) {
    internal val objectMapper = ObjectMapper().apply {
        registerModule(kotlinModule())
    }

    fun importAll(backupJsonString: JsonNode) {
        val backupDTO = backupParser.parse(backupJsonString)
        backupImporter.import(backupDTO)
    }

    fun exportAll(): String {
        val backupDTO = backupExporter.exportAll()
        return objectMapper.writeValueAsString(backupDTO)
    }
}