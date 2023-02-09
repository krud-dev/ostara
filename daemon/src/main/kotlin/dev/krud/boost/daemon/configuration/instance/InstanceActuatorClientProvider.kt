package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstanceActuatorClientProvider(
    @Lazy
    private val crudHandler: CrudHandler
) {
    fun provide(instance: Instance): ActuatorHttpClient {
        return ActuatorHttpClient(instance.actuatorUrl) // TODO: cache
    }

    fun provide(instanceId: UUID): ActuatorHttpClient {
        val instance = crudHandler
            .show(instanceId, Instance::class.java)
            .applyPolicies()
            .execute() ?: throw ResourceNotFoundException(Instance.NAME, instanceId)
        return provide(instance)
    }

    fun <T> doWith(instanceId: UUID, block: (ActuatorHttpClient) -> T): T {
        val actuatorClient = provide(instanceId)
        return block(actuatorClient)
    }

    fun <T> doWith(instance: Instance, block: (ActuatorHttpClient) -> T): T {
        val actuatorClient = provide(instance)
        return block(actuatorClient)
    }
}
