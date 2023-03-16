package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.ActuatorHttpClientImpl
import dev.krud.boost.daemon.configuration.application.authentication.ApplicationAuthenticationService
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.ResourceNotFoundException
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstanceActuatorClientProviderImpl(
    @Lazy
    private val crudHandler: CrudHandler,
    @Lazy
    private val applicationAuthenticationService: ApplicationAuthenticationService
) : InstanceActuatorClientProvider {
    override fun provide(instance: Instance): ActuatorHttpClient {
        return ActuatorHttpClientImpl(instance.actuatorUrl, applicationAuthenticationService.getEffectiveAuthentication(instance.parentApplicationId).authentication.authenticator) // TODO: cache
    }

    override fun provide(instanceId: UUID): ActuatorHttpClient {
        val instance = crudHandler
            .show(instanceId, Instance::class.java)
            .applyPolicies()
            .execute() ?: throw ResourceNotFoundException(Instance.NAME, instanceId)
        return provide(instance)
    }

    override fun provideForUrl(url: String, authentication: Authentication): ActuatorHttpClient {
        if (authentication is Authentication.Inherit) {
            throwBadRequest("Cannot use Inherit authentication for a url")
        }
        return ActuatorHttpClientImpl(url, authentication.authenticator)
    }
}