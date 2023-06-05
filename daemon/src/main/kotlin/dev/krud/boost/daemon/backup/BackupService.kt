package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.databind.JsonNode
import org.springframework.stereotype.Service

@Service
class BackupService(
    private val backupExporter: BackupExporter,
    private val backupParser: BackupParser,
    private val backupImporter: BackupImporter
) {
    fun importAll(json: JsonNode) {
        val backupDTO = backupParser.parse(json)
        backupImporter.import(backupDTO)
    }

    fun exportAll(): BackupDTO {
        return backupExporter.exportAll()
    }
}