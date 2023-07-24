package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.messaging.FolderMovedEventMessage
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Service
import java.util.*

@Service
class FolderService(
    private val folderKrud: Krud<Folder, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel
) {
    fun getFolder(folderId: UUID): Folder? {
        return folderKrud.showById(folderId)
    }

    fun getFolderOrThrow(folderId: UUID): Folder {
        return getFolder(folderId) ?: throwNotFound("Folder $folderId not found")
    }

    fun moveFolder(folderId: UUID, newParentFolderId: UUID?, newSort: Double?): Folder {
        val folder = getFolderOrThrow(folderId)
        if (folder.parentFolderId == newParentFolderId && folder.sort == newSort) {
            return folder
        }
        folder.parentFolderId = newParentFolderId // TODO: check if folder exists, should fail on foreign key for now
        folder.sort = newSort
        log.debug { "Folder $folderId moved" }
        val updatedFolder = folderKrud.update(folder)
        systemEventsChannel.send(FolderMovedEventMessage(FolderMovedEventMessage.Payload(folderId, folder.parentFolderId, newParentFolderId, newSort)))
        return updatedFolder
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}