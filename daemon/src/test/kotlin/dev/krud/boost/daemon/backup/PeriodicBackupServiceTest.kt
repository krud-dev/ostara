//package dev.krud.boost.daemon.backup
//
//import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
//import dev.krud.boost.daemon.base.config.AppMainProperties
//import org.junit.jupiter.api.BeforeEach
//import org.junit.jupiter.api.Test
//import org.junit.jupiter.api.io.TempDir
//import org.mockito.kotlin.mock
//import org.mockito.kotlin.whenever
//import java.nio.file.Files
//import java.nio.file.Path
//import java.util.*
//
//class PeriodicBackupServiceTest {
//    @TempDir
//    lateinit var temporaryDirectory: Path
//
//    private val backupService = mock<BackupService>()
//    private lateinit var appMainProperties: AppMainProperties
//    private lateinit var periodicBackupService: PeriodicBackupService
//
//    @BeforeEach
//    fun setUp() {
//        appMainProperties = AppMainProperties()
//            .apply {
//                backupDirectory = temporaryDirectory
//            }
//        periodicBackupService = PeriodicBackupService(
//            backupService,
//            appMainProperties,
//            jacksonObjectMapper()
//        )
//    }
//
//    @Test
//    fun `saveBackup should save a gzipped backup to the backup directory`() {
//        whenever(backupService.exportAll()).thenReturn(
//            BackupDTO(
//                version = 1,
//                date = Date(0),
//                tree = emptyList()
//            )
//        )
//        periodicBackupService.saveBackup()
//        val backupFiles = Files.list(temporaryDirectory).toList()
//        println()
//    }
//
//}