package dev.krud.boost.daemon.configuration.instance.hostname

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Component
import java.util.*

@Component
class EnvInstanceHostnameResolverImpl(
    private val instanceActuatorClientProvider: InstanceActuatorClientProvider
) : InstanceHostnameResolver {
    @Cacheable(cacheNames = ["instanceHostnameCache"], key = "#instanceId")
    override fun resolveHostname(instanceId: UUID): String? {
        val client = instanceActuatorClientProvider.provide(instanceId)
        return client.resolveAndReturnHostname()
    }

    override fun resolveHostname(url: String): String? {
        val client = instanceActuatorClientProvider.provideForUrl(url)
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