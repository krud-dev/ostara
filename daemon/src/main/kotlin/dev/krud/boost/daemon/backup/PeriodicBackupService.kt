package dev.krud.boost.daemon.backup

import com.fasterxml.jackson.databind.ObjectMapper
import dev.krud.boost.daemon.base.config.AppMainProperties
import okio.GzipSink
import okio.GzipSource
import okio.buffer
import okio.sink
import okio.source

class PeriodicBackupService(
    private val backupService: BackupService,
    private val appMainProperties: AppMainProperties,
    private val objectMapper: ObjectMapper
) {
    fun saveBackup() {
        val backup = backupService.exportAll()
        val backupFile = appMainProperties.backupDirectory.resolve("backup-${System.currentTimeMillis()}.json.gz")
            .toFile()
        backupFile.sink().buffer().use { sink ->
            GzipSink(sink).buffer().use { gzipSink ->
                gzipSink.write(
                    objectMapper.writeValueAsBytes(backup)
                )
            }
        }
    }
}