package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.backup.ro.BackupDTO
import dev.krud.boost.daemon.backup.ro.SystemBackupRO
import dev.krud.boost.daemon.base.config.AppMainProperties
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.time.TimeService
import dev.krud.boost.daemon.utils.ONE_HOUR
import io.github.oshai.kotlinlogging.KotlinLogging
import okio.GzipSink
import okio.GzipSource
import okio.buffer
import okio.sink
import okio.source
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.atomic.AtomicLong

@Service
class SystemBackupService(
    private val backupImporter: BackupImporter,
    private val backupExporter: BackupExporter,
    private val backupJwtService: BackupJwtService,
    private val appMainProperties: AppMainProperties,
    private val timeService: TimeService
) {
    private val lastBackupCreationTime = AtomicLong(0)

    /**
     * Create an automatic backup every hour.
     */
    @Scheduled(fixedRate = 300_000)
    fun createAutoSystemBackup() {
        val now = timeService.nowMillis()
        val last = lastBackupCreationTime.get()
        if (now - last < ONE_HOUR) {
            return
        }
        createSystemBackup(true)
        lastBackupCreationTime.set(timeService.nowMillis())
    }
    /**
     * Create a new backup and save it to the backup directory.
     * @param auto whether this backup was created automatically or manually, used in the file name
     */
    fun createSystemBackup(auto: Boolean): Result<SystemBackupRO> = runCatching {
        val type = if (auto) "auto" else "manual"
        val fileName = "backup-${type}-${System.currentTimeMillis()}.jwt.gz"
        val backupDTO = backupExporter.exportAll()
        val signed = backupJwtService.sign(backupDTO)
        val file = appMainProperties.backupDirectory
            .resolve(fileName)
            .toFile()
        file.sink().buffer().use { sink ->
            GzipSink(sink).buffer().use { gzipSink ->
                gzipSink.writeString(signed, Charsets.UTF_8)
            }
        }
        SystemBackupRO(
            fileName = fileName,
            date = Date()
        )
    }

    /**
     * Restore a backup from the backup directory.
     * @param fileName the name of the backup file
     */
    fun restoreSystemBackup(fileName: String): Result<Unit> = runCatching {
        val backupDTO = getSystemBackupDto(fileName).getOrThrow()
        backupImporter.deleteAndImport(backupDTO)
    }

    /**
     * Delete a backup from the backup directory.
     * @param fileName the name of the backup file
     */
    fun deleteSystemBackup(fileName: String): Result<Unit> = runCatching {
        val file = appMainProperties.backupDirectory
            .resolve(fileName)
            .toFile()
        if (!file.exists()) {
            throwNotFound("File does not exist: $fileName")
        }
        val result = file.delete()
        if (!result) {
            throwInternalServerError("Could not delete file: $fileName")
        }
    }

    fun listSystemBackups(includeFailures: Boolean): Result<List<SystemBackupRO>> = runCatching {
        appMainProperties.backupDirectory
            .toFile()
            .apply {
                if (!exists()) {
                    throwNotFound("Backup directory does not exist: $this")
                }
            }
            .listFiles()
            .filter { file ->
                file.extension == "gz"
            }.map { file ->
                val result = runCatching {
                    getSystemBackupDto(file.name)
                        .getOrThrow()
                }

                SystemBackupRO(
                    fileName = file.name,
                    date = Date(file.lastModified()),
                    valid = result.isSuccess,
                    error = result.exceptionOrNull()?.message
                )

            }
            .filter { ro ->
                includeFailures || ro.valid
            }
    }

    fun getSystemBackupDto(fileName: String): Result<BackupDTO> = runCatching {
        val file = appMainProperties.backupDirectory
            .resolve(fileName)
            .toFile()
        if (!file.exists()) {
            throwNotFound("File does not exist: $fileName")
        }
        val content = file.source().buffer().use { source ->
            GzipSource(source).buffer().use { gzipSource ->
                gzipSource.readUtf8()
            }
        }
        backupJwtService.verify(content)
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}