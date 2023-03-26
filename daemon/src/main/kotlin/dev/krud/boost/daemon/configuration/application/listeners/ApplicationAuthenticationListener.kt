package dev.krud.boost.daemon.configuration.application.listeners

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationAuthenticationChangedMessage
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationMovedEventMessage
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.messaging.FolderAuthenticationChangedMessage
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.krud.Krud
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.QueueChannel
import org.springframework.messaging.Message
import org.springframework.messaging.support.GenericMessage
import org.springframework.stereotype.Component
import java.util.*

@Component
class ApplicationAuthenticationListener(
    private val applicationKrud: Krud<Application, UUID>,
    private val instanceHealthCheckRequestChannel: QueueChannel,
    private val applicationService: ApplicationService,
    cacheManager: CacheManager
) {
    private val applicationEffectiveAuthenticationCache by cacheManager.resolve()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onMessage(message: Message<*>) {
        when (message) {
            is FolderAuthenticationChangedMessage -> handleParentFolderAuthenticationChanged(message.payload.folderId)
            is ApplicationMovedEventMessage -> forceUpdateInstancesHealth(message.payload.applicationId)
            is ApplicationAuthenticationChangedMessage -> forceUpdateInstancesHealth(message.payload.applicationId)
        }
    }

    fun handleParentFolderAuthenticationChanged(folderId: UUID) {
        applicationKrud.searchByFilter {
            where {
                Application::parentFolderId Equal folderId
                Application::authenticationType Equal Authentication.Inherit.DEFAULT.type
            }
        }
            .forEach { application ->
                forceUpdateInstancesHealth(application.id)
            }
    }

    fun forceUpdateInstancesHealth(applicationId: UUID) {
        applicationEffectiveAuthenticationCache.evict(applicationId)
        val instances = applicationService.getApplicationInstances(applicationId)
        instances.forEach {
            instanceHealthCheckRequestChannel.send(
                GenericMessage(it.id)
            )
        }
    }
}