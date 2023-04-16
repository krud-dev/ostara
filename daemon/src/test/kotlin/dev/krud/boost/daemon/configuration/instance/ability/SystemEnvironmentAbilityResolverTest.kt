package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.model.EnvActuatorResponse
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue

class SystemEnvironmentAbilityResolverTest {
    private val resolver = SystemEnvironmentAbilityResolver()
    private val actuatorClient: ActuatorHttpClient = mock()

    @Test
    fun `resolver should return true if has property source`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("env"),
            actuatorClient
        )

        whenever(actuatorClient.env()).thenReturn(
            Result.success(
                EnvActuatorResponse(
                    emptySet(),
                    listOf(EnvActuatorResponse.PropertySource("systemEnvironment", emptyMap()))
                )
            )
        )

        val result = resolver.hasAbility(
            options
        )

        expectThat(result)
            .isTrue()
    }

    @Test
    fun `resolver should return false property source is not present`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("env"),
            actuatorClient
        )

        whenever(actuatorClient.env()).thenReturn(
            Result.success(
                EnvActuatorResponse(
                    emptySet(),
                    emptyList()
                )
            )
        )

        val result = resolver.hasAbility(
            options
        )

        expectThat(result)
            .isFalse()
    }

    @Test
    fun `resolver should return false if env endpoint isn't present`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            emptySet(),
            actuatorClient
        )

        val result = resolver.hasAbility(
            options
        )

        expectThat(result)
            .isFalse()
    }
}