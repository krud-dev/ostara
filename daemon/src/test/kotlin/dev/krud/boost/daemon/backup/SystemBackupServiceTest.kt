package dev.krud.boost.daemon.backup

import com.auth0.jwt.exceptions.JWTDecodeException
import dev.krud.boost.daemon.backup.ro.BackupDTO
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
import org.springframework.http.HttpStatus
import org.springframework.web.server.ResponseStatusException
import strikt.api.expect
import strikt.assertions.isA
import strikt.assertions.isEqualTo
import strikt.assertions.isFailure
import strikt.assertions.isFalse
import strikt.assertions.isTrue
import strikt.assertions.startsWith
import java.nio.file.Files
import java.nio.file.Path
import java.util.*

class SystemBackupServiceTest {
    @TempDir
    lateinit var temporaryDirectory: Path

    private val backupImporter = mock<BackupImporter>()
    private val backupExporter = mock<BackupExporter>()
    private val backupJwtService = mock<BackupJwtService>()
    private lateinit var appMainProperties: AppMainProperties
    private lateinit var systemBackupService: SystemBackupService

    @BeforeEach
    fun setUp() {
        appMainProperties = AppMainProperties()
            .apply {
                backupDirectory = temporaryDirectory
            }
        systemBackupService = SystemBackupService(
            backupImporter,
            backupExporter,
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
        whenever(backupExporter.exportAll()).thenReturn(dto)
        whenever(backupJwtService.sign(dto)).thenReturn(token)
        val manualBackup = systemBackupService.createSystemBackup(false).getOrThrow()
        val autoBackup = systemBackupService.createSystemBackup(true).getOrThrow()
        val backupFiles = Files.list(temporaryDirectory).toList()
        expect {
            that(manualBackup).apply {
                get { fileName } startsWith "backup-manual"
                get { valid }.isTrue()
                get { auto }.isFalse()
            }
            that(autoBackup).apply {
                get { fileName } startsWith "backup-auto"
                get { valid }.isTrue()
                get { auto }.isTrue()
            }
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
        backupFileName.createGzippedFile(token)
        systemBackupService.restoreSystemBackup("some-backup.jwt.gz")
        verify(backupImporter, times(1)).deleteAndImport(dto)

    }

    @Test
    fun `restoreBackup should throw if file does not exist`() {
        val result = systemBackupService.restoreSystemBackup("some-backup.jwt.gz")
        expect {
            that(result).isFailure()
            that(result.exceptionOrNull()!!).isA<ResponseStatusException>()
                .and {
                    get { statusCode }.isEqualTo(HttpStatus.NOT_FOUND)
                }
        }
    }

    @Test
    fun `restoreBackup should throw if verification fails`() {
        val token = "this is invalid"
        val backupFileName = temporaryDirectory.resolve("some-backup.jwt.gz")
        backupFileName.createGzippedFile(token)
        whenever(backupJwtService.verify(token)).thenThrow(
            JWTDecodeException("Invalid token")
        )
        val result = systemBackupService.restoreSystemBackup("some-backup.jwt.gz")
        expect {
            that(result).isFailure()
            that(result.exceptionOrNull()!!).isA<JWTDecodeException>()
        }
    }



    @Test
    fun `listBackups should list all valid backups when includeFailures is false`() {
        setupListBackups()
        val backups = systemBackupService.listSystemBackups(false)
            .getOrThrow()
        expect {
            that(backups.size).isEqualTo(1)
            val firstBackup = backups.find { it.fileName == "first.gz" }!!
            that(firstBackup.valid).isTrue()
        }
    }

    @Test
    fun `listBackups should list all valid backups when includeFailures is true`() {
        setupListBackups()
        val backups = systemBackupService.listSystemBackups(true)
            .getOrThrow()
        expect {
            that(backups.size).isEqualTo(2)
            val firstBackup = backups.find { it.fileName == "first.gz" }!!
            val secondBackup = backups.find { it.fileName == "second.gz" }!!
            that(firstBackup.valid).isTrue()
            that(secondBackup.valid).isFalse()
        }
    }

    private fun setupListBackups() {
        val token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODY2NDA4MzAsImJhY2t1cCI6IntcInZlcnNpb25cIjowLFwiZGF0ZVwiOjAsXCJ0cmVlXCI6W119In0.nKc-Yzg4wG4USRb9-vQufrLpYiuhAUzzJhnBmiOttYA"
        val invalidToken = "this is invalid"
        whenever(
            backupJwtService.verify(token)
        )
            .thenReturn(
                BackupDTO(
                    version = 1,
                    date = Date(0),
                    tree = emptyList()
                )
            )
        whenever(
            backupJwtService.verify(invalidToken)
        )
            .thenThrow(JWTDecodeException("invalid token"))

        temporaryDirectory.resolve(
            "first.gz"
        )
            .createGzippedFile(token)
        temporaryDirectory.resolve(
            "second.gz"
        )
            .createGzippedFile(invalidToken)
    }

    private fun Path.gzippedContent(): String {
        return source().buffer().use { fileSource ->
            GzipSource(fileSource).buffer().use { gzipSource ->
                gzipSource.readUtf8()
            }
        }
    }

    private fun Path.createGzippedFile(content: String) {
        sink().buffer().use { fileSink ->
            GzipSink(fileSink).buffer().use { gzipSink ->
                gzipSink.writeString(content, Charsets.UTF_8)
            }
        }
    }
}