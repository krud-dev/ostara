package dev.krud.boost.daemon.configuration.application.authentication

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.authentication.FolderAuthenticationService
import io.github.oshai.KotlinLogging
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationAuthenticationService(
    private val applicationService: ApplicationService,
    private val folderAuthenticationService: FolderAuthenticationService
) {
    @Cacheable(cacheNames = ["applicationEffectiveAuthenticationCache"], key = "#applicationId")
    fun getEffectiveAuthentication(applicationId: UUID): EffectiveAuthentication {
        log.debug { "Getting effective authentication for application $applicationId" }
        val application = applicationService.getApplicationOrThrow(applicationId)
        if (application.authentication !is Authentication.Inherit) {
            val effectiveAuthentication = EffectiveAuthentication(application.authentication, EffectiveAuthentication.SourceType.APPLICATION, applicationId)
            log.debug { "Application $applicationId has its own authentication ${application.authentication}, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        if (application.parentFolderId == null) {
            val effectiveAuthentication = EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.APPLICATION, applicationId)
            log.debug { "Application $applicationId has no parent folder, returning $effectiveAuthentication" }
            return effectiveAuthentication
        }

        log.debug { "Application $applicationId inherits authentication from folder ${application.parentFolderId}, fetching parent effective authentication" }
        return folderAuthenticationService.getEffectiveAuthentication(application.parentFolderId!!)
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}