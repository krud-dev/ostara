package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.stubApplication
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.messaging.FolderAuthenticationChangedMessage
import dev.krud.boost.daemon.configuration.folder.stubFolder
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.verify
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.integration.channel.PublishSubscribeChannel
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isNull
import java.util.*

class FolderPersistentHooksTest {
    private val folderKrud: Krud<Folder, UUID> = TestKrud(Folder::class.java)
    private val applicationKrud: Krud<Application, UUID> = TestKrud(Application::class.java)
    private val systemEventsChannel: PublishSubscribeChannel = mock()
    private val cacheManager = ConcurrentMapCacheManager("folderEffectiveAuthenticationCache")
    private val folderEffectiveAuthenticationCache = cacheManager.getCache("folderEffectiveAuthenticationCache")!!
    private val folderPersistentHooks = FolderPersistentHooks(folderKrud, applicationKrud, systemEventsChannel, cacheManager)

    @Test
    fun `onDelete should cascade delete all child folders`() {
        val folder = stubFolder()
        val childFolder = stubFolder(
            parentFolderId = folder.id
        )
        folderKrud.create(childFolder)
        folderPersistentHooks.onDelete(folder)

        expectThat(
            folderKrud.showById(childFolder.id)
        )
            .isEqualTo(null)
    }

    @Test
    fun `onDelete should cascade delete all child applications`() {
        val folder = stubFolder()
        val childApplication = stubApplication(
            parentFolderId = folder.id
        )
        applicationKrud.create(childApplication)
        folderPersistentHooks.onDelete(folder)

        expectThat(
            folderKrud.showById(childApplication.id)
        )
            .isEqualTo(null)
    }

    @Test
    fun `postUpdate should send event and evict cache if authentication changed`() {
        val folder = stubFolder(
            authentication = Authentication.Inherit.DEFAULT
        )
        folderEffectiveAuthenticationCache.put(folder.id, "test")
        folder.saveOrGetCopy()
        folder.authentication = Authentication.None.DEFAULT
        folderPersistentHooks.postUpdate(folder)
        val captor = argumentCaptor<FolderAuthenticationChangedMessage>()
        verify(systemEventsChannel).send(captor.capture())
        val message = captor.firstValue
        expectThat(message.payload.folderId).isEqualTo(folder.id)
        expectThat(folderEffectiveAuthenticationCache.get(folder.id)).isNull()
    }
}