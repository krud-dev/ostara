package dev.krud.boost.daemon.controller.api.v1

import com.fasterxml.jackson.databind.JsonNode
import dev.krud.boost.daemon.backup.BackupDTO
import dev.krud.boost.daemon.backup.BackupService
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/backup")
@Tag(name = "Backup", description = "Backup API")
class BackupController(
    private val backupService: BackupService
) {
    @PostMapping("/exportAll", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Export all configurations to JSON"
    )
    @ApiResponse(responseCode = "200", description = "Exported configurations")
    fun exportAll(): BackupDTO {
        return backupService.exportAll()
    }

    @PostMapping("/importAll")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(
        summary = "Import all configurations from JSON"
    )
    @ApiResponse(responseCode = "201", description = "Imported configurations")
    fun importAll(@RequestBody jsonNode: JsonNode) {
        backupService.importAll(jsonNode)
    }
}