package dev.krud.boost.daemon.controller.api.v1.folder

import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.authentication.FolderAuthenticationService
import dev.krud.boost.daemon.controller.api.v1.API_PREFIX
import io.swagger.v3.oas.annotations.Operation
import io.swagger.v3.oas.annotations.media.Content
import io.swagger.v3.oas.annotations.responses.ApiResponse
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/folders/{folderId}/authentication")
@Tag(name = "Folder Authentication", description = "Folder Authentication API")
class FolderAuthenticationController(
    private val folderAuthenticationService: FolderAuthenticationService
) {
    @GetMapping("/effective", produces = ["application/json"])
    @ResponseStatus(HttpStatus.OK)
    @Operation(
        summary = "Get instance effective authentication"
    )
    @ApiResponse(responseCode = "201", description = "Received effective authentication")
    @ApiResponse(responseCode = "404", description = "Folder not found", content = [Content()])
    fun getEffectiveAuthentication(@PathVariable folderId: UUID): EffectiveAuthentication {
        return folderAuthenticationService.getEffectiveAuthentication(folderId)
    }
}