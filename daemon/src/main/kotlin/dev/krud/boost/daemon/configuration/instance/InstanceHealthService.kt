package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.ro.InstanceHealthRO
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceHealthService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider
) {
    fun getHealth(instanceId: UUID): InstanceHealthRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getHealth(instance)
    }

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
}