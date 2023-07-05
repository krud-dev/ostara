package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.ActuatorHttpClientImpl
import dev.krud.boost.daemon.agent.model.Agent
import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.authentication.ApplicationAuthenticationService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstanceActuatorClientProviderImpl(
    @Lazy
    private val applicationService: ApplicationService,
    @Lazy
    private val applicationAuthenticationService: ApplicationAuthenticationService,
    private val agentKrud: Krud<Agent, UUID>,
    private val applicationKrud: Krud<Application, UUID>
) : InstanceActuatorClientProvider {
    override fun provide(instance: Instance): ActuatorHttpClient {
        val effectiveAuthentication = applicationAuthenticationService.getEffectiveAuthentication(instance.parentApplicationId)
        val application = applicationKrud.showById(instance.parentApplicationId)!!
        val agent = if (application.parentAgentId != null) {
            agentKrud.showById(application.parentAgentId!!)
        } else {
            null
        }
        log.debug {
            "Providing actuator client for instance ${instance.id} with url ${instance.actuatorUrl} using authentication $effectiveAuthentication"
        }

        return ActuatorHttpClientImpl(agent?.url, agent?.apiKey, instance.agentExternalId, instance.actuatorUrl, effectiveAuthentication.authentication.authenticator, applicationService.getApplicationDisableSslVerification(instance.parentApplicationId))
    }

    override fun provideForUrl(url: String, authentication: Authentication, disableSslVerification: Boolean): ActuatorHttpClient {
        log.debug {
            "Providing actuator client for url $url using authentication $authentication"
        }
        if (authentication is Authentication.Inherit) {
            throwBadRequest("Cannot use Inherit authentication for a url")
        }
        return ActuatorHttpClientImpl(url, authentication.authenticator, disableSslVerification)
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}