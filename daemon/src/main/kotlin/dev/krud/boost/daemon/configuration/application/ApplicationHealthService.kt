package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus.Companion.toApplicationHealthStatus
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationHealthService(
    private val applicationService: ApplicationService,
    private val instanceHealthService: InstanceHealthService,
    private val systemEventsChannel: PublishSubscribeChannel,
    private val cacheManager: CacheManager,
) {
    private val applicationHealthCache = cacheManager.getCache("applicationHealthCache")!!

    fun getHealth(application: Application): ApplicationHealthRO {
        if (application.instances.isEmpty()) {
            return ApplicationHealthRO.pending()
        }
        val entries = applicationHealthCache.get(application.id) {
            application.instances.associate { it.id to instanceHealthService.getHealth(it).status }
        }!!

        return ApplicationHealthRO(
            entries.values.toApplicationHealthStatus(),
            Date(),
            Date()
        )
    }

    fun getHealth(applicationId: UUID): ApplicationHealthRO = getHealth(
        applicationService.getApplicationOrThrow(applicationId)
    )

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                handleInstanceHealthChangedEvent(event)
            }
        }
    }

    protected fun handleInstanceHealthChangedEvent(event: InstanceHealthChangedEventMessage) {
        val (parentApplicationId, instanceId, oldStatus, newStatus) = event.payload
        val value = applicationHealthCache.get(parentApplicationId) {
            mapOf(
                instanceId to newStatus
            )
        }!!
        if (value[instanceId] == newStatus) {
            return
        }

        val newValue = value + mapOf(
            instanceId to newStatus
        )

        applicationHealthCache.put(
            parentApplicationId,
            newValue
        )

        systemEventsChannel.send(
            ApplicationHealthUpdatedEventMessage(
                ApplicationHealthUpdatedEventMessage.Payload(
                    parentApplicationId,
                    newValue.values.toApplicationHealthStatus()
                )
            )
        )
    }
}