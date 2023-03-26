package dev.krud.boost.daemon.configuration.folder.authentication

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.FolderService
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class FolderAuthenticationService(
    private val folderService: FolderService
) {
    @Cacheable(cacheNames = ["folderEffectiveAuthenticationCache"], key = "#folderId")
    fun getEffectiveAuthentication(folderId: UUID): EffectiveAuthentication {
        val folder = folderService.getFolderOrThrow(folderId)
        if (folder.authentication !is Authentication.Inherit) {
            return EffectiveAuthentication(folder.authentication, EffectiveAuthentication.SourceType.FOLDER, folderId)
        }

        if (folder.parentFolderId == null) {
            return EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.FOLDER, folderId)
        }

        return getEffectiveAuthentication(folder.parentFolderId!!)
    }
}