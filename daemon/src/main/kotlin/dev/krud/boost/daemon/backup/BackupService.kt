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
        val dto = backupParser.parse(json)
        importAll(dto)
    }

    fun importAll(dto: BackupDTO) {
        backupImporter.import(dto)
    }

    fun exportAll(): BackupDTO {
        return backupExporter.exportAll()
    }
}