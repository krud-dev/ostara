package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import java.util.*

interface InstanceActuatorClientProvider {
    fun provide(instance: Instance): ActuatorHttpClient

    fun provide(instanceId: UUID): ActuatorHttpClient

    fun <T> doWith(instanceId: UUID, block: (ActuatorHttpClient) -> T): T {
        val actuatorClient = provide(instanceId)
        return block(actuatorClient)
    }

    fun <T> doWith(instance: Instance, block: (ActuatorHttpClient) -> T): T {
        val actuatorClient = provide(instance)
        return block(actuatorClient)
    }
}