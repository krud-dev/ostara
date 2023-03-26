package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus.Companion.toApplicationHealthStatus
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.utils.resolve
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.CachePut
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
    cacheManager: CacheManager
) {
    private val applicationHealthCache by cacheManager.resolve()
    private val applicationInstancesHealthCache by cacheManager.resolve()
    private val scope = CoroutineScope(Dispatchers.Default)

    fun getCachedHealth(applicationId: UUID): ApplicationHealthRO {
        val cached = applicationHealthCache.get(applicationId, ApplicationHealthRO::class.java)
        if (cached != null) {
            return cached
        }

        scope.launch {
            val health = getHealth(applicationId)
            systemEventsChannel.send(
                ApplicationHealthUpdatedEventMessage(
                    ApplicationHealthUpdatedEventMessage.Payload(
                        applicationId,
                        health
                    )
                )
            )
            applicationHealthCache.put(applicationId, getHealth(applicationId))
        }

        return  ApplicationHealthRO.pending()
    }

    @CachePut(cacheNames = ["applicationHealthCache"], key = "#application.id")
    fun getHealth(application: Application): ApplicationHealthRO {
        if (application.instanceCount == 0) {
            return ApplicationHealthRO.empty()
        }
        val instances = applicationService.getApplicationInstances(application.id)
        val entries = applicationInstancesHealthCache.get(application.id) {
            instances.associate { it.id to instanceHealthService.getHealth(it).status }
        }!!

        return ApplicationHealthRO(
            entries.values.toApplicationHealthStatus(),
            Date(),
            Date()
        )
    }

    @CachePut(cacheNames = ["applicationHealthCache"], key = "#applicationId")
    fun getHealth(applicationId: UUID): ApplicationHealthRO = getHealth(
        applicationService.getApplicationOrThrow(applicationId)
    )

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                handleInstanceHealthChange(event.payload.parentApplicationId, event.payload.instanceId, event.payload.newHealth.status)
            }
            is InstanceDeletedEventMessage -> {
                handleInstanceHealthChange(event.payload.parentApplicationId, event.payload.instanceId, null)
            }
            is InstanceMovedEventMessage -> {
                val health = instanceHealthService.getHealth(event.payload.instanceId)
                handleInstanceHealthChange(event.payload.newParentApplicationId, event.payload.instanceId, health.status)
                handleInstanceHealthChange(event.payload.oldParentApplicationId, event.payload.instanceId, null)
            }
        }
    }

    protected fun handleInstanceHealthChange(applicationId: UUID, instanceId: UUID, newStatus: InstanceHealthStatus?) {
        val value = applicationInstancesHealthCache.get(applicationId) {
            if (newStatus == null) {
                emptyMap()
            } else {
                mapOf(
                    instanceId to newStatus
                )
            }
        }!!
        if (value[instanceId] == newStatus) {
            return
        }

        val newValue = value + mapOf(
            instanceId to newStatus
        )

        applicationInstancesHealthCache.put(
            applicationId,
            newValue
        )

        systemEventsChannel.send(
            ApplicationHealthUpdatedEventMessage(
                ApplicationHealthUpdatedEventMessage.Payload(
                    applicationId,
                    ApplicationHealthRO(
                        newValue.values.toApplicationHealthStatus()
                    )
                )
            )
        )
    }
}