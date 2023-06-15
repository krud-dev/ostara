package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.backup.SystemBackupService
import dev.krud.boost.daemon.backup.ro.BackupDTO
import dev.krud.boost.daemon.backup.ro.SystemBackupRO
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/systemBackup")
@Tag(name = "System Backup", description = "System Backup API")
class SystemBackupController(
    private val systemBackupService: SystemBackupService
) {
    @GetMapping("/", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "List all system backups"
    )
    @ApiResponse(responseCode = "200", description = "List of system backups")
    fun listSystemBackups(@RequestParam(defaultValue = "false") includeFailures: Boolean = false): List<SystemBackupRO> {
        return systemBackupService.listSystemBackups(includeFailures).getOrThrow()
    }

    @DeleteMapping("/delete")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(
        summary = "Delete system backup"
    )
    @ApiResponse(responseCode = "204", description = "System backup deleted")
    @ApiResponse(responseCode = "404", description = "System backup not found")
    fun deleteSystemBackup(@RequestParam fileName: String) {
        systemBackupService.deleteSystemBackup(fileName)
    }

    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Create system backup"
    )
    @ApiResponse(responseCode = "201", description = "System backup created")
    fun createSystemBackup(): SystemBackupRO {
        return systemBackupService.createSystemBackup(false).getOrThrow()
    }

    @PostMapping("/restore")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Restore system backup"
    )
    @ApiResponse(responseCode = "201", description = "System backup restored")
    @ApiResponse(responseCode = "404", description = "System backup not found")
    fun restoreSystemBackup(@RequestParam fileName: String) {
        systemBackupService.restoreSystemBackup(fileName)
    }

    @GetMapping("/show", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Show system backup"
    )
    @ApiResponse(responseCode = "200", description = "System backup")
    @ApiResponse(responseCode = "404", description = "System backup not found")
    fun getSystemBackup(fileName: String): BackupDTO {
        return systemBackupService.getSystemBackupDto(fileName).getOrThrow()
    }
}