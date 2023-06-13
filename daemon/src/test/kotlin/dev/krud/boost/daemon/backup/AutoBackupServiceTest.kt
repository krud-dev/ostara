package dev.krud.boost.daemon.backup

import dev.krud.boost.daemon.base.config.AppMainProperties
import okio.GzipSink
import okio.GzipSource
import okio.buffer
import okio.sink
import okio.source
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.io.TempDir
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import strikt.api.expect
import strikt.assertions.isEqualTo
import strikt.assertions.startsWith
import java.nio.file.Files
import java.nio.file.Path
import java.util.*

class AutoBackupServiceTest {
    @TempDir
    lateinit var temporaryDirectory: Path

    private val backupService = mock<BackupService>()
    private val backupJwtService = mock<BackupJwtService>()
    private lateinit var appMainProperties: AppMainProperties
    private lateinit var autoBackupService: AutoBackupService

    @BeforeEach
    fun setUp() {
        appMainProperties = AppMainProperties()
            .apply {
                backupDirectory = temporaryDirectory
            }
        autoBackupService = AutoBackupService(
            backupService,
            backupJwtService,
            appMainProperties
        )
    }

    @Test
    fun `createBackup should save a gzipped backup to the backup directory`() {
        val dto = BackupDTO(
            version = 0,
            date = Date(0),
            tree = emptyList()
        )
        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2NDA4MzAsImJhY2t1cCI6IntcInZlcnNpb25cIjowLFwiZGF0ZVwiOjAsXCJ0cmVlXCI6W119In0.nKc-Yzg4wG4USRb9-vQufrLpYiuhAUzzJhnBmiOttYA"
        whenever(backupService.exportAll()).thenReturn(dto)
        whenever(backupJwtService.sign(dto)).thenReturn(token)
        val manualFileName = autoBackupService.createBackup(false)
        val autoFileName = autoBackupService.createBackup(true)
        val backupFiles = Files.list(temporaryDirectory).toList()
        expect {
            that(manualFileName).startsWith("backup-manual")
            that(autoFileName).startsWith("backup-auto")
            that(backupFiles.size).isEqualTo(2)
            val manualFile = backupFiles[0]
            val autoFile = backupFiles[1]
            val manualContent = manualFile.gzippedContent()
            val autoContent = autoFile.gzippedContent()
            that(manualContent).isEqualTo(token)
            that(autoContent).isEqualTo(token)
        }
    }

    @Test
    fun `restoreBackup should import everything from a file`() {
        val dto = BackupDTO(
            version = 0,
            date = Date(0),
            tree = emptyList()
        )
        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2NDA4MzAsImJhY2t1cCI6IntcInZlcnNpb25cIjowLFwiZGF0ZVwiOjAsXCJ0cmVlXCI6W119In0.nKc-Yzg4wG4USRb9-vQufrLpYiuhAUzzJhnBmiOttYA"
        whenever(backupJwtService.verify(token)).thenReturn(dto)
        val backupFileName = temporaryDirectory.resolve("some-backup.jwt.gz")
        backupFileName
            .sink()
            .buffer()
            .use { fileSink ->
                GzipSink(fileSink).buffer().use { gzipZink ->
                    gzipZink.writeString(token, Charsets.UTF_8)
                }
            }
        autoBackupService.restoreBackup("some-backup.jwt.gz")
        verify(backupService, times(1)).importAll(dto)

    }

    private fun Path.gzippedContent(): String {
        return source().buffer().use { fileSource ->
            GzipSource(fileSource).buffer().use { gzipSource ->
                gzipSource.readUtf8()
            }
        }
    }
}