package dev.krud.boost.daemon.configuration.folder.authentication

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.FolderService
import dev.krud.boost.daemon.configuration.folder.stubFolder
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.util.*

class FolderAuthenticationServiceTest {
    private val folderService = mock<FolderService>()
    private val cacheManager = ConcurrentMapCacheManager(
        "folderEffectiveAuthenticationCache"
    )
    private val folderAuthenticationService = FolderAuthenticationService(folderService, cacheManager)

    @Test
    fun `get effective authentication should return own if not inherit`() {
        val folder = stubFolder(authentication = Authentication.None.DEFAULT, parentFolderId = UUID.randomUUID())
        whenever(folderService.getFolderOrThrow(folder.id))
            .thenReturn(folder)
        val result = folderAuthenticationService.getEffectiveAuthentication(folder.id)
        expectThat(result)
            .isEqualTo(EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.FOLDER, folder.id))
    }

    @Test
    fun `get effective authentication on inherit should return none if parent is null`() {
        val folder = stubFolder(authentication = Authentication.Inherit.DEFAULT, parentFolderId = null)
        whenever(folderService.getFolderOrThrow(folder.id))
            .thenReturn(folder)
        val result = folderAuthenticationService.getEffectiveAuthentication(folder.id)
        expectThat(result)
            .isEqualTo(EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.FOLDER, folder.id))
    }

    @Test
    fun `get effective authentication on inherit should return parent if parent is not null`() {
        val parentFolder = stubFolder(authentication = Authentication.Basic("user", "user"), parentFolderId = null)
        val folder = stubFolder(authentication = Authentication.Inherit.DEFAULT, parentFolderId = parentFolder.id)
        whenever(folderService.getFolderOrThrow(folder.id))
            .thenReturn(folder)
        whenever(folderService.getFolderOrThrow(parentFolder.id))
            .thenReturn(parentFolder)
        val result = folderAuthenticationService.getEffectiveAuthentication(folder.id)
        expectThat(result)
            .isEqualTo(EffectiveAuthentication(Authentication.Basic("user", "user"), EffectiveAuthentication.SourceType.FOLDER, parentFolder.id))
    }
}