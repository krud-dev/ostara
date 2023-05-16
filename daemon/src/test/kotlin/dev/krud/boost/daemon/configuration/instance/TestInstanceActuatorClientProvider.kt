package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import org.mockito.Mockito.mock
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import java.util.*

/**
 * This class is used to mock the InstanceActuatorClientProvider in tests.
 * Add the `@TestInstanceActuatorClientProvider.Configure` annotation to your test class to use it.
 * Once configured, you can autowire it in your test class and use the provide methods to get a mockito mock ActuatorHttpClient for a specific instance.
 * Example:
 * ```kotlin
 *    val client = instanceActuatorClientProvider.provide(instance)
 *    whenever(client.getHealth()).thenReturn(Health())
 * ```
 */
class TestInstanceActuatorClientProvider : InstanceActuatorClientProvider {
    private val instanceMocks: MutableMap<UUID, ActuatorHttpClient> = mutableMapOf()

    private val urlMocks: MutableMap<String, ActuatorHttpClient> = mutableMapOf()

    override fun provide(instance: Instance): ActuatorHttpClient {
        return instanceMocks.getOrPut(instance.id) { mock(ActuatorHttpClient::class.java) }
    }

    override fun provideForUrl(url: String, authentication: Authentication, disableSslVerification: Boolean): ActuatorHttpClient {
        return urlMocks.getOrPut(url) { mock(ActuatorHttpClient::class.java) }
    }

    @TestConfiguration
    class Configuration {
        @Bean
        @Primary
        fun testInstanceActuatorClientProvider(): TestInstanceActuatorClientProvider {
            return TestInstanceActuatorClientProvider()
        }
    }

    @Target(AnnotationTarget.CLASS)
    @Import(Configuration::class)
    annotation class Configure
}