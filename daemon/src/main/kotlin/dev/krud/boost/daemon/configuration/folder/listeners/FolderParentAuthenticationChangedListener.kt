package dev.krud.boost.daemon.configuration.folder.listeners

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.messaging.FolderAuthenticationChangedMessage
import dev.krud.boost.daemon.configuration.folder.messaging.FolderMovedEventMessage
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.KotlinLogging
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Component
import java.util.*

@Component
class FolderParentAuthenticationChangedListener(
    private val folderKrud: Krud<Folder, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel,
    cacheManager: CacheManager
) {
    private val folderEffectiveAuthenticationCache by cacheManager.resolve()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onMessage(message: Message<*>) {
        when (message) {
            is FolderAuthenticationChangedMessage -> updateEffectiveAuthenticationForFolder(message.payload.folderId)
            is FolderMovedEventMessage -> updateEffectiveAuthenticationForFolder(message.payload.folderId)
        }
    }

    fun updateEffectiveAuthenticationForFolder(folderId: UUID) {
        log.debug { "Folder $folderId authentication changed, updating children " }
        folderKrud.searchByFilter {
            where {
                Folder::parentFolderId Equal folderId
                Folder::authenticationType Equal Authentication.Inherit.DEFAULT.type
            }
        }
            .forEach { childFolder ->
                log.debug { "Updating effective folder authentication for ${childFolder.id}" }
                folderEffectiveAuthenticationCache.evict(childFolder.id)
                systemEventsChannel.send(
                    FolderAuthenticationChangedMessage(
                        FolderAuthenticationChangedMessage.Payload(childFolder.id)
                    )
                )
            }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}