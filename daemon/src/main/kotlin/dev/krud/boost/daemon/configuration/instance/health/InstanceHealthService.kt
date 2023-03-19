package dev.krud.boost.daemon.configuration.instance.health

import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.messaging.Message
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val systemEventsChannel: PublishSubscribeChannel,
    cacheManager: CacheManager
) {
    private val instanceHealthCache by cacheManager.resolve()

    fun getCachedHealth(instanceId: UUID): InstanceHealthRO {
        return instanceHealthCache.get(instanceId, InstanceHealthRO::class.java)
            ?: InstanceHealthRO.unknown()
    }

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
        }
    }

    private fun updateInstanceHealth(instance: Instance): InstanceHealthRO {
        val currentHealth = getHealth(instance)
        val prevHealth = instanceHealthCache.get(instance.id, InstanceHealthRO::class.java)

        if (prevHealth?.status != currentHealth.status) {
            systemEventsChannel.send(
                InstanceHealthChangedEventMessage(
                    InstanceHealthChangedEventMessage.Payload(
                        instance.parentApplicationId,
                        instance.id,
                        prevHealth ?: InstanceHealthRO.unknown(),
                        currentHealth
                    )
                )
            )
        }

        instanceHealthCache.put(instance.id, currentHealth)
        return currentHealth
    }
}