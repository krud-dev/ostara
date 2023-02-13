package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstanceActuatorClientProviderImpl(
    @Lazy
    private val crudHandler: CrudHandler
) : InstanceActuatorClientProvider {
    override fun provide(instance: Instance): ActuatorHttpClient {
        return ActuatorHttpClient(instance.actuatorUrl) // TODO: cache
    }

    override fun provide(instanceId: UUID): ActuatorHttpClient {
        val instance = crudHandler
            .show(instanceId, Instance::class.java)
            .applyPolicies()
            .execute() ?: throw ResourceNotFoundException(Instance.NAME, instanceId)
        return provide(instance)
    }
}