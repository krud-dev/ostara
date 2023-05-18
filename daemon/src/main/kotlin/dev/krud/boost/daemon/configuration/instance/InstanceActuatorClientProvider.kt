package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.instance.entity.Instance

interface InstanceActuatorClientProvider {
    fun provide(instance: Instance): ActuatorHttpClient

    fun provideForUrl(url: String, authentication: Authentication = Authentication.None.DEFAULT, disableSslVerification: Boolean = false): ActuatorHttpClient

    fun <T> doWith(instance: Instance, block: (ActuatorHttpClient) -> T): T {
        val actuatorClient = provide(instance)
        return block(actuatorClient)
    }
}