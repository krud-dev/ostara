package dev.krud.boost.daemon.configuration.instance.health

import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.model.InstanceHealthLog
import dev.krud.boost.daemon.eventlog.EventLogService
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val crudHandler: CrudHandler,
    private val eventLogService: EventLogService,
    private val cacheManager: CacheManager
) {
    private val instanceHealthCache = cacheManager.getCache("instanceHealthCache")!!
    private val lastInstanceHealth = mutableMapOf<UUID, InstanceHealthRO>()

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instanceId")
    fun getCachedHealth(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getCachedHealth(instance)
    }

    @Cacheable(cacheNames = ["instanceHealthCache"], key = "#instance.id")
    fun getCachedHealth(instance: Instance): InstanceHealthRO {
        return lastInstanceHealth[instance.id] ?: updateInstanceHealth(instance)
    }

    fun getLiveHealth(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getLiveHealth(instance)
    }

    fun getLiveHealth(instance: Instance): InstanceHealthRO {
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
        //TODO: fix filter
//        val filter = WHERE<InstanceHealthLog> {
//            InstanceHealthLog::creationTime isNull         }

        val oldLogs = crudHandler
            .index(null, InstanceHealthLog::class.java)
            .execute()
            .results

        val cutoffDate = LocalDateTime.now().minusHours(24)
        oldLogs.forEach {
            if(it.creationTime < cutoffDate) {
                crudHandler.delete(it.id, InstanceHealthLog::class.java).execute()
            }
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

    private fun updateInstanceHealth(instance: Instance): InstanceHealthRO {
        val currentHealth = getLiveHealth(instance)
        val prevHealth = lastInstanceHealth[instance.id]
        crudHandler.create(InstanceHealthLog(instance.id, currentHealth.status, currentHealth.statusText)).execute()

        if (prevHealth?.status != currentHealth.status) {
            val severity = if (prevHealth?.status == InstanceHealthStatus.UP) {
                EventLogSeverity.ERROR
            } else {
                EventLogSeverity.INFO
            }

            eventLogService.logEvent(
                EventLogType.INSTANCE_HEALTH_CHANGED,
                instance.id,
                "Instance ${instance.alias} [ ${instance.id} ] health status changed from ${prevHealth?.status ?: InstanceHealthStatus.UNKNOWN} to ${currentHealth.status}",
                severity
            )
        }

        lastInstanceHealth[instance.id] = currentHealth
        return currentHealth
    }
}