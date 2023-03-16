package dev.krud.boost.daemon.configuration.application.authentication

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.authentication.FolderAuthenticationService
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationAuthenticationService(
    private val applicationService: ApplicationService,
    private val folderAuthenticationService: FolderAuthenticationService,
    cacheManager: CacheManager
) {
    private val applicationEffectiveAuthenticationCache by cacheManager.resolve()
    // TODO: decide when to evict

    @Cacheable(cacheNames = ["applicationEffectiveAuthenticationCache"], key = "#applicationId")
    fun getEffectiveAuthentication(applicationId: UUID): EffectiveAuthentication {
        val application = applicationService.getApplicationOrThrow(applicationId)
        if (application.authentication !is Authentication.Inherit) {
            return EffectiveAuthentication(application.authentication, EffectiveAuthentication.SourceType.APPLICATION, applicationId)
        }

        if (application.parentFolderId == null) {
            return EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.APPLICATION, applicationId)
        }

        return folderAuthenticationService.getEffectiveAuthentication(application.parentFolderId!!)
    }
}