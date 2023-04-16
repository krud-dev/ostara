package dev.krud.boost.daemon.configuration.folder.listeners

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.messaging.FolderAuthenticationChangedMessage
import dev.krud.boost.daemon.configuration.folder.messaging.FolderMovedEventMessage
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

class FolderParentAuthenticationChangedListenerTest {
    private val folderKrud: Krud<Folder, UUID> = TestKrud(Folder::class.java)
    private val systemEventsChannel: PublishSubscribeChannel = mock()
    private val cacheManager = ConcurrentMapCacheManager("folderEffectiveAuthenticationCache")
    private val folderEffectiveAuthenticationCache = cacheManager.getCache("folderEffectiveAuthenticationCache")!!
    val listener = FolderParentAuthenticationChangedListener(folderKrud, systemEventsChannel, cacheManager)

    @Test
    fun `onMessage FolderAuthenticationChangedMessage should cascade authentication change to child folders`() {
        val parentFolder = stubFolder()
        val child = stubFolder(
            parentFolderId = parentFolder.id
        )

        folderKrud.create(child)
        folderEffectiveAuthenticationCache.put(child.id, child.authentication)

        listener.onMessage(
            FolderAuthenticationChangedMessage(
                FolderAuthenticationChangedMessage.Payload(
                    parentFolder.id
                )
            )
        )

        val messageCaptor = argumentCaptor<FolderAuthenticationChangedMessage>()

        verify(systemEventsChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expectThat(message.payload.folderId)
            .isEqualTo(child.id)
        expectThat(folderEffectiveAuthenticationCache.get(child.id))
            .isNull()
    }

    @Test
    fun `onMessage FolderMovedEventMessage should cascade authentication change to child folders`() {
        val parentFolder = stubFolder()
        val child = stubFolder(
            parentFolderId = parentFolder.id
        )

        folderKrud.create(child)
        folderEffectiveAuthenticationCache.put(child.id, child.authentication)

        listener.onMessage(
            FolderMovedEventMessage(
                FolderMovedEventMessage.Payload(
                    parentFolder.id,
                    null,
                    null,
                    null
                )
            )
        )

        val messageCaptor = argumentCaptor<FolderAuthenticationChangedMessage>()

        verify(systemEventsChannel).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expectThat(message.payload.folderId)
            .isEqualTo(child.id)
        expectThat(folderEffectiveAuthenticationCache.get(child.id))
            .isNull()
    }
}