package dev.krud.boost.daemon.configuration.application

import com.github.benmanes.caffeine.cache.Cache
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus.Companion.toApplicationHealthStatus
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationHealthUpdatedEventMessage
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthCheckPerformedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.utils.resolve
import io.github.oshai.kotlinlogging.KotlinLogging
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
    private val applicationInstancesHealth = mutableMapOf<UUID, Set<InstanceHealthRO>>()
    private val applicationHealthCache by cacheManager.resolve()

    fun getCachedHealth(application: Application): ApplicationHealthRO {
        log.debug { "Getting cached health for application ${application.id}" }
        if (application.instanceCount == 0) {
            log.debug { "Application ${application.id} has no instances, skipping cache and returning empty health" }
            return ApplicationHealthRO.empty(application.id)
        }

        val cached = applicationHealthCache.get(application.id, ApplicationHealthRO::class.java)
        log.debug { "Cached health for application ${application.id} is $cached" }
        return cached ?: ApplicationHealthRO.pending(application.id)
    }

    @CachePut(cacheNames = ["applicationHealthCache"], key = "#application.id")
    fun getHealth(application: Application): ApplicationHealthRO {
        log.debug { "Getting health for application ${application.id}" }
        if (application.instanceCount == 0) {
            log.debug { "Application ${application.id} has no instances, returning empty health" }
            return ApplicationHealthRO.empty(application.id)
        }
        log.trace { "Fetching instances for application ${application.id}" }
        val instances = applicationService.getApplicationInstances(application.id)
        log.trace { "Got ${instances.size} instances for application ${application.id}}" }
        val healthStatus = instances
            .map { instanceHealthService.getCachedHealth(it.id).status }
            .toSet()
            .toApplicationHealthStatus()

        return ApplicationHealthRO(
            application.id,
            healthStatus,
            Date(),
            Date()
        )
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthCheckPerformedEventMessage -> {
                log.debug { "Handling instance health changed event for instance ${event.payload.instanceId}" }
                handleInstanceHealthChange(event.payload.parentApplicationId, event.payload.instanceId, event.payload.newHealth)
            }
            is InstanceDeletedEventMessage -> {
                log.debug { "Handling instance deleted event for instance ${event.payload.instanceId}" }
                handleInstanceHealthChange(event.payload.parentApplicationId, event.payload.instanceId, null)
            }
            is InstanceMovedEventMessage -> {
                log.debug { "Handling instance moved event for instance ${event.payload.instanceId}" }
                val health = instanceHealthService.getCachedHealth(event.payload.instanceId)
                handleInstanceHealthChange(event.payload.newParentApplicationId, event.payload.instanceId, health)
                handleInstanceHealthChange(event.payload.oldParentApplicationId, event.payload.instanceId, null)
            }
        }
    }

    protected fun handleInstanceHealthChange(applicationId: UUID, instanceId: UUID, newInstanceHealth: InstanceHealthRO?) {
        log.debug {
            "Handling instance health change for application $applicationId, instance $instanceId, new health $newInstanceHealth"
        }
        val instances = applicationInstancesHealth.getOrPut(applicationId) { emptySet() }
        val instanceHealths = if (newInstanceHealth == null) {
            instances.filter { it.instanceId != instanceId }
        } else {
            instances.filter { it.instanceId != instanceId } + newInstanceHealth
        }
            .toSet()
        applicationInstancesHealth[applicationId] = instanceHealths

        val cached = applicationHealthCache.get(applicationId, ApplicationHealthRO::class.java)
        val newHealth = ApplicationHealthRO(
            applicationId,
            instanceHealths
                .toApplicationHealthStatus()
        )

        log.debug {
            "Application $applicationId computed health is $newHealth"
        }

        if (cached?.status != newHealth.status) {
            log.debug {
                "Application $applicationId health changed from ${cached?.status} to ${newHealth.status}"
            }
            systemEventsChannel.send(
                ApplicationHealthUpdatedEventMessage(
                    ApplicationHealthUpdatedEventMessage.Payload(
                        applicationId,
                        newHealth
                    )
                )
            )
        }
        applicationHealthCache.put(applicationId, newHealth)
    }

    fun getAllApplicationHealthsFromCache(): Map<UUID, ApplicationHealthRO> {
        log.debug { "Getting all application healths from cache" }
        val nativeCache = applicationHealthCache.nativeCache as Cache<UUID, ApplicationHealthRO>
        return nativeCache.asMap()
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}