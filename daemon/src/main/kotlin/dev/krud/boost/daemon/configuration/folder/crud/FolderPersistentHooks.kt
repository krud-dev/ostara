package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.messaging.FolderAuthenticationChangedMessage
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateHooks
import org.springframework.cache.CacheManager
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Component
import java.util.*

@Component
class FolderPersistentHooks(
    private val folderKrud: Krud<Folder, UUID>,
    private val applicationKrud: Krud<Application, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel,
    cacheManager: CacheManager
) : DeleteHooks<UUID, Folder>, UpdateHooks<UUID, Folder> {
    private val folderEffectiveAuthenticationCache by cacheManager.resolve()
    override fun postUpdate(entity: Folder) {
        val copy = entity.saveOrGetCopy() as Folder
        if (copy.authentication != entity.authentication) {
            systemEventsChannel.send(
                FolderAuthenticationChangedMessage(
                    FolderAuthenticationChangedMessage.Payload(entity.id)
                )
            )
            folderEffectiveAuthenticationCache.evict(entity.id)
        }
    }

    override fun onDelete(entity: Folder) {
        folderKrud.deleteByFilter {
            where {
                Folder::parentFolderId Equal entity.id
            }
        }
        applicationKrud.deleteByFilter {
            where {
                Application::parentFolderId Equal entity.id
            }
        }
    }
}