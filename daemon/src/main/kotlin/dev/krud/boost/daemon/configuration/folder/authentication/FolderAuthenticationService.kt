package dev.krud.boost.daemon.configuration.folder.authentication

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.FolderService
import io.github.oshai.KotlinLogging
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class FolderAuthenticationService(
    private val folderService: FolderService
) {
    @Cacheable(cacheNames = ["folderEffectiveAuthenticationCache"], key = "#folderId")
    fun getEffectiveAuthentication(folderId: UUID): EffectiveAuthentication {
        log.debug { "Getting effective authentication for folder $folderId" }
        val folder = folderService.getFolderOrThrow(folderId)
        if (folder.authentication !is Authentication.Inherit) {
            val effectiveAuthentication = EffectiveAuthentication(folder.authentication, EffectiveAuthentication.SourceType.FOLDER, folderId)
            log.debug { "Folder $folderId has its own authentication ${folder.authentication}, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        if (folder.parentFolderId == null) {
            val effectiveAuthentication = EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.FOLDER, folderId)
            log.debug { "Folder $folderId has no parent folder, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        log.debug { "Folder $folderId inherits authentication from folder ${folder.parentFolderId}, fetching parent effective authentication" }
        return getEffectiveAuthentication(folder.parentFolderId!!)
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}