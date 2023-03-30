package dev.krud.boost.daemon.configuration.instance.hostname.resolver

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import org.springframework.stereotype.Component

@Component
class EnvInstanceHostnameResolverImpl(
    private val instanceActuatorClientProvider: InstanceActuatorClientProvider
) : InstanceHostnameResolver {
    override fun resolveHostname(instance: Instance): String? {
        val client = instanceActuatorClientProvider.provide(instance)
        return client.resolveAndReturnHostname()
    }

    private fun ActuatorHttpClient.resolveAndReturnHostname(): String? {
        return envProperty(HOSTNAME_ENV_KEY).getOrNull()?.property?.value.apply {
            if (isNullOrBlank()) {
                return null
            }
        }
    }

    companion object {
        const val HOSTNAME_ENV_KEY = "HOSTNAME"
    }
}