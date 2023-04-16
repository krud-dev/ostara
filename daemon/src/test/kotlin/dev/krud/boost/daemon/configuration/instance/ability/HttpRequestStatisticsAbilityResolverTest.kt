package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.model.MetricsActuatorResponse
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue

class HttpRequestStatisticsAbilityResolverTest {
    private val resolver = HttpRequestStatisticsAbilityResolver()
    private val actuatorClient: ActuatorHttpClient = mock()

    @Test
    fun `resolver should return true if has metric`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("metrics"),
            actuatorClient
        )

        whenever(actuatorClient.metrics()).thenReturn(
            Result.success(
                MetricsActuatorResponse(
                    listOf(METRIC_NAME)
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
    fun `resolver should return false if no metrics are present`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("metrics"),
            actuatorClient
        )

        whenever(actuatorClient.metrics()).thenReturn(
            Result.success(
                MetricsActuatorResponse(
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
    fun `resolver should return false if metrics endpoint isn't present`() {
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

    companion object {
        private const val METRIC_NAME = "http.server.requests"
    }
}