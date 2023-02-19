package dev.krud.boost.daemon.configuration.instance.health

import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.model.InstanceHealthLog
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.modelfilter.dsl.where
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val crudHandler: CrudHandler,
    private val systemEventsChannel: PublishSubscribeChannel,
    cacheManager: CacheManager
) {
    private val instanceHealthCache by cacheManager.resolve()

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instanceId")
    fun getHealth(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getHealth(instance)
    }

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instance.id")
    fun getHealth(instance: Instance): InstanceHealthRO {
        val actuatorClient = actuatorClientProvider.provide(instance)
        val testConnection = try {
            actuatorClient.testConnection()
        } catch (e: Exception) {
            return InstanceHealthRO.unknown()
        }

        if (!testConnection.success) {
            return InstanceHealthRO.unreachable("Failed to connect to instance with status ${testConnection.statusCode} and message ${testConnection.statusText}")
        }

        if (!testConnection.validActuator) {
            return InstanceHealthRO.invalid("URL is reachable but it is not an actuator endpoint")
        }

        val health = actuatorClient.health().getOrElse {
            return InstanceHealthRO.unknown(it.message)
        }

        return when (health.status) {
            HealthActuatorResponse.Status.UP -> InstanceHealthRO.up()
            HealthActuatorResponse.Status.DOWN -> InstanceHealthRO.down()
            HealthActuatorResponse.Status.OUT_OF_SERVICE -> InstanceHealthRO.outOfService()
            HealthActuatorResponse.Status.UNKNOWN -> InstanceHealthRO.unknown()
        }
    }

    @Scheduled(fixedRate = 60000)
    fun getAllInstanceHealth() {
        val instances = instanceService.getAllInstances()
        instances.forEach { instance ->
            updateInstanceHealth(instance)
        }
    }

    @Scheduled(fixedDelay = 3600000)
    fun deleteOldLogs() {
        val filter = where<InstanceHealthLog> {
            InstanceHealthLog::creationTime.isNull()
        }

        val oldLogs = crudHandler
            .index(filter, InstanceHealthLog::class.java)
            .execute()
            .results

        val cutoffDate = Date(
            LocalDateTime.now()
                .minusDays(1)
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli()
        )
        oldLogs.forEach {
            if (it.creationTime < cutoffDate) {
                crudHandler.delete(it.id, InstanceHealthLog::class.java).execute()
            }
        }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                updateInstanceHealth(
                    instanceService.getInstanceOrThrow(event.payload.instanceId)
                )
            }

            is InstanceUpdatedEventMessage -> {
                updateInstanceHealth(
                    instanceService.getInstanceOrThrow(event.payload.instanceId)
                )
            }

            is InstanceDeletedEventMessage -> {
                instanceHealthCache.evict(event.payload.instanceId)
            }
        }
    }

    private fun updateInstanceHealth(instance: Instance): InstanceHealthRO {
        val currentHealth = getHealth(instance)
        val prevHealth = instanceHealthCache.get(instance.id, InstanceHealthRO::class.java)
        crudHandler.create(InstanceHealthLog(instance.id, currentHealth.status, currentHealth.statusText)).execute()

        if (prevHealth?.status != currentHealth.status) {
            systemEventsChannel.send(
                InstanceHealthChangedEventMessage(
                    InstanceHealthChangedEventMessage.Payload(
                        instance.parentApplicationId,
                        instance.id,
                        prevHealth?.status ?: InstanceHealthStatus.UNKNOWN,
                        currentHealth.status
                    )
                )
            )
        }

        instanceHealthCache.put(instance.id, currentHealth)
        return currentHealth
    }
}