package dev.krud.boost.daemon.configuration.instance.health

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val cacheManager: CacheManager
) {
    private val instanceHealthCache = cacheManager.getCache("instanceHealthCache")!!

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

        val health = try {
            actuatorClient.health()
        } catch (e: Exception) {
            return InstanceHealthRO.unknown()
        }

        return when (health.status) {
            ActuatorHttpClient.HealthResponse.Status.UP -> InstanceHealthRO.up()
            ActuatorHttpClient.HealthResponse.Status.DOWN -> InstanceHealthRO.down()
            ActuatorHttpClient.HealthResponse.Status.OUT_OF_SERVICE -> InstanceHealthRO.outOfService()
            ActuatorHttpClient.HealthResponse.Status.UNKNOWN -> InstanceHealthRO.unknown()
        }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                instanceHealthCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                instanceHealthCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                instanceHealthCache.evict(event.payload.instanceId)
            }
        }
    }
}