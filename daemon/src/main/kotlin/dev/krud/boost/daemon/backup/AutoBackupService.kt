package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.base.config.AppMainProperties
import okio.GzipSink
import okio.GzipSource
import okio.buffer
import okio.sink
import okio.source
import org.springframework.stereotype.Service

@Service
class AutoBackupService(
    private val backupService: BackupService,
    private val backupJwtService: BackupJwtService,
    private val appMainProperties: AppMainProperties
) {
    /**
     * Create a new backup and save it to the backup directory.
     * @param auto whether this backup was created automatically or manually, used in the file name
     */
    fun createBackup(auto: Boolean): String {
        val type = if (auto) "auto" else "manual"
        val fileName = "backup-${type}-${System.currentTimeMillis()}.jwt.gz"
        val backupDTO = backupService.exportAll()
        val signed = backupJwtService.sign(backupDTO)
        val file = appMainProperties.backupDirectory
            .resolve(fileName)
            .toFile()
        file.sink().buffer().use { sink ->
            GzipSink(sink).buffer().use { gzipSink ->
                gzipSink.writeString(signed, Charsets.UTF_8)
            }
        }
        return fileName
    }

    /**
     * Restore a backup from the backup directory.
     * @param fileName the name of the backup file
     */
    fun restoreBackup(fileName: String) {
        val backupDTO = getBackup(fileName)
        backupService.importAll(backupDTO)
    }

    fun listBackups(includeFailures: Boolean): Map<String, Result<BackupDTO>> {
        return appMainProperties.backupDirectory
            .toFile()
            .listFiles()
            .filter { file ->
                file.extension == "gz"
            }
            .map { file ->
                file.name
            }.associateWith { fileName ->
                runCatching {
                    getBackup(fileName)
                }
            }
            .filter { (_, result) ->
                includeFailures || result.isSuccess
            }
    }

    private fun getBackup(fileName: String): BackupDTO {
        val file = appMainProperties.backupDirectory
            .resolve(fileName)
            .toFile()
        if (!file.exists()) {
            error("File does not exist: $fileName")
        }
        val content = file.source().buffer().use { source ->
            GzipSource(source).buffer().use { gzipSource ->
                gzipSource.readUtf8()
            }
        }
        return backupJwtService.verify(content)
    }
}