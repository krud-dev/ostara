package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.model.MetricsActuatorResponse
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.DynamicTest
import org.junit.jupiter.api.DynamicTest.dynamicTest
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestFactory
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue

class CacheStatisticsAbilityResolverTest {
    private val resolver = CacheStatisticsAbilityResolver()
    private val actuatorClient: ActuatorHttpClient = mock()

    @TestFactory
    fun `resolver happy flow should return true`(): Iterator<DynamicTest> {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("metrics", "caches"),
            actuatorClient
        )

        return METRIC_NAMES
            .map { metricName ->
                dynamicTest("resolver should return true if metric $metricName is present") {
                    whenever(actuatorClient.metrics()).thenReturn(
                        Result.success(
                            MetricsActuatorResponse(
                                listOf(metricName)
                            )
                        )
                    )
                    val result = resolver.hasAbility(
                        options
                    )

                    expectThat(result)
                        .isTrue()
                }
            }.iterator()
    }

    @Test
    fun `resolver should return false if no metrics are present`() {
        val options = InstanceAbilityResolver.Options(
            stubInstance(),
            setOf("metrics", "caches"),
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
            setOf("caches"),
            actuatorClient
        )

        val result = resolver.hasAbility(
            options
        )

        expectThat(result)
            .isFalse()
    }

    companion object {
        private val METRIC_NAMES = listOf(
            "cache.gets",
            "cache.puts",
            "cache.evictions",
            "cache.hits",
            "cache.misses",
            "cache.removals",
            "cache.size"
        )
    }
}