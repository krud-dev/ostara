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
import dev.krud.boost.daemon.utils.sendGeneric
import kotlinx.coroutines.launch
import kotlinx.coroutines.newFixedThreadPoolContext
import kotlinx.coroutines.runBlocking
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.messaging.Message
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.server.ResponseStatusException
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val systemEventsChannel: PublishSubscribeChannel,
    private val instanceHealthCheckRequestChannel: QueueChannel,
    cacheManager: CacheManager
) {
    private val instanceHealthCache by cacheManager.resolve()
    private val dispatcher = newFixedThreadPoolContext(4, "instance-health-checker")

    fun getCachedHealth(instanceId: UUID): InstanceHealthRO {
        return instanceHealthCache.get(instanceId, InstanceHealthRO::class.java)
            ?: InstanceHealthRO.pending().apply {
                instanceHealthCheckRequestChannel.sendGeneric(instanceId)
            }
    }

    @ServiceActivator(inputChannel = "instanceHealthCheckRequestChannel")
    fun updateInstanceHealth(instanceId: UUID) {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        updateInstanceHealthAndReturn(instance)
    }

    fun updateInstanceHealthAndReturn(instance: Instance): InstanceHealthRO {
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

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instanceId")
    fun getHealth(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getHealth(instance)
    }

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instance.id")
    fun getHealth(instance: Instance): InstanceHealthRO {
        val actuatorClient = actuatorClientProvider.provide(instance)
        val response = try {
            actuatorClient.testConnection()
        } catch (e: Exception) {
            return InstanceHealthRO.unknown()
        }

        if (!response.success) {
            return InstanceHealthRO.unreachable("Failed to connect to instance with status ${response.statusCode} and message ${response.statusText}", response.statusCode)
        }

        if (!response.validActuator) {
            return InstanceHealthRO.invalid("URL is reachable but it is not an actuator endpoint", response.statusCode)
        }

        val health = actuatorClient.health().getOrElse {
            return when (it) {
                is ResponseStatusException -> InstanceHealthRO.unknown(it.message, it.statusCode.value())
                else -> InstanceHealthRO.unknown(it.message)
            }
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
        val startTime = System.currentTimeMillis()
        runBlocking {
            instances.forEach { instance ->
                launch(dispatcher) {
                    updateInstanceHealthAndReturn(instance)
                }
            }
        }
        println("Finished updating all instance health in ${System.currentTimeMillis() - startTime}ms")
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                updateInstanceHealthAndReturn(
                    instanceService.getInstanceOrThrow(event.payload.instanceId)
                )
            }

            is InstanceUpdatedEventMessage -> {
                updateInstanceHealthAndReturn(
                    instanceService.getInstanceOrThrow(event.payload.instanceId)
                )
            }
        }
    }
}