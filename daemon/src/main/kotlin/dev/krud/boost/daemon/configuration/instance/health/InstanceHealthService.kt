package dev.krud.boost.daemon.configuration.instance.health

import com.github.benmanes.caffeine.cache.Cache
import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.agent.AgentHealthService
import dev.krud.boost.daemon.agent.model.AgentHealthDTO
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO.Companion.isStale
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthCheckPerformedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.launch
import kotlinx.coroutines.newFixedThreadPoolContext
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.DisposableBean
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
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
    private val agentHealthService: AgentHealthService,
    cacheManager: CacheManager
) : DisposableBean {
    private val instanceHealthCache by cacheManager.resolve()
    private val dispatcher = newFixedThreadPoolContext(4, "instance-health-checker")

    override fun destroy() {
        log.debug { "Shutting down dispatcher" }
        dispatcher.close()
    }

    fun getCachedHealth(instanceId: UUID): InstanceHealthRO {
        log.debug { "Getting cached health for instance $instanceId" }
        return instanceHealthCache.get(instanceId, InstanceHealthRO::class.java)
            ?: InstanceHealthRO.pending(instanceId)
    }

    @ServiceActivator(inputChannel = "instanceHealthCheckRequestChannel")
    fun updateInstanceHealth(instanceId: UUID) {
        updateInstanceHealthAndReturn(instanceId)
    }

    fun updateInstanceHealthAndReturn(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        return updateInstanceHealthAndReturn(instance)
    }

    fun updateInstanceHealthAndReturn(instance: Instance): InstanceHealthRO {
        log.debug {
            "Updating health for instance ${instance.id}"
        }
        val prevHealth = instanceHealthCache.get(instance.id, InstanceHealthRO::class.java)
        log.debug {
            "Instance ${instance.id} previous health is $prevHealth"
        }
        val currentHealth = getHealth(instance)
        if (prevHealth?.status != currentHealth.status || prevHealth.isStale()) {
            log.debug {
                val message = if (prevHealth?.isStale() == true) {
                    "Instance ${instance.id} health is stale"
                } else {
                    "Instance ${instance.id} health changed from $prevHealth to $currentHealth"
                }
                message
            }
            systemEventsChannel.send(
                InstanceHealthChangedEventMessage(
                    InstanceHealthChangedEventMessage.Payload(
                        instance.parentApplicationId,
                        instance.id,
                        prevHealth ?: InstanceHealthRO.unknown(instance.id),
                        currentHealth
                    )
                )
            )
        }

        systemEventsChannel.send(
            InstanceHealthCheckPerformedEventMessage(
                InstanceHealthCheckPerformedEventMessage.Payload(
                    instance.parentApplicationId,
                    instance.id,
                    prevHealth ?: InstanceHealthRO.unknown(instance.id),
                    currentHealth
                )
            )
        )

        instanceHealthCache.put(instance.id, currentHealth)
        return currentHealth
    }

    fun getHealth(instance: Instance): InstanceHealthRO {
        log.debug { "Getting health for instance ${instance.id}" }
        if (instance.parentAgentId != null) {
            log.debug { "Instance ${instance.id} is managed by agent ${instance.parentAgentId}, checking agent health" }
            val agentHealth = agentHealthService.getCachedHealth(instance.parentAgentId!!)
            if (agentHealth?.status != AgentHealthDTO.Companion.Status.HEALTHY) {
                log.debug { "Agent ${instance.parentAgentId} is not healthy, instance ${instance.id} is not healthy" }
                return InstanceHealthRO.unknown(instance.id, "Agent is not healthy")
            }
        }
        val actuatorClient = actuatorClientProvider.provide(instance)
        val response = try {
            actuatorClient.testConnection()
        } catch (e: Exception) {
            log.error(e) { "Failed to test connection to instance ${instance.id}" }
            return InstanceHealthRO.unknown(instance.id)
        }

        if (!response.success) {
            log.debug { "Test connection to instance ${instance.id} failed with status ${response.statusCode} and message ${response.statusText}" }
            return InstanceHealthRO.unreachable(instance.id, "Failed to connect to instance with status ${response.statusCode} and message ${response.statusText}", response.statusCode)
        }

        if (!response.validActuator) {
            log.debug { "Instance ${instance.id} with status ${response.statusCode} and message ${response.statusText} not a valid actuator" }
            return InstanceHealthRO.invalid(instance.id, "URL is reachable but it is not an actuator endpoint", response.statusCode)
        }

        val health = actuatorClient.health().getOrElse {
            log.error(it) { "Failed to get health for instance ${instance.id}" }
            return when (it) {
                is ResponseStatusException -> InstanceHealthRO.unknown(instance.id, it.message, it.statusCode.value())
                else -> InstanceHealthRO.unknown(instance.id, it.message)
            }
        }

        return when (health.status) {
            HealthActuatorResponse.Status.UP -> InstanceHealthRO.up(instance.id)
            HealthActuatorResponse.Status.DOWN -> InstanceHealthRO.down(instance.id)
            HealthActuatorResponse.Status.OUT_OF_SERVICE -> InstanceHealthRO.outOfService(instance.id)
            HealthActuatorResponse.Status.UNKNOWN -> InstanceHealthRO.unknown(instance.id)
        }.apply {
            log.debug { "Instance ${instance.id} is ${this.status}" }
        }
    }

    @Scheduled(fixedRate = 60000)
    protected fun updateAllInstanceHealth() {
        log.debug {
            "Updating health for all instances"
        }
        val instances = instanceService.getAllInstances()
        runBlocking {
            instances.forEach { instance ->
                launch(dispatcher) {
                    updateInstanceHealthAndReturn(instance)
                }
            }
        }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                log.debug { "Instance created: Updating health for instance ${event.payload.instanceId}" }
                updateInstanceHealthAndReturn(
                    instanceService.getInstanceFromCacheOrThrow(event.payload.instanceId)
                )
            }

            is InstanceUpdatedEventMessage -> {
                log.debug { "Instance updated: Updating health for instance ${event.payload.instanceId}" }
                updateInstanceHealthAndReturn(
                    instanceService.getInstanceFromCacheOrThrow(event.payload.instanceId)
                )
            }
        }
    }

    fun getAllInstanceHealthsFromCache(): Map<UUID, InstanceHealthRO> {
        log.debug { "Getting all instance healths from cache" }
        val nativeCache = instanceHealthCache.nativeCache as Cache<UUID, InstanceHealthRO>
        return nativeCache.asMap()
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}