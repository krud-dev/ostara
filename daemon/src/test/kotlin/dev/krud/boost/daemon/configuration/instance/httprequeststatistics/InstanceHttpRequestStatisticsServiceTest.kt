package dev.krud.boost.daemon.configuration.instance.httprequeststatistics

import dev.krud.boost.daemon.actuator.model.MetricActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.TestInstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.ability.TestInstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.cache.CacheManager
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class InstanceHttpRequestStatisticsServiceTest {
    private val instanceService: InstanceService = mock()
    private val actuatorClientProvider = TestInstanceActuatorClientProvider()
    private val instanceAbilityService = TestInstanceAbilityService()
    private val cacheManager: CacheManager = ConcurrentMapCacheManager()
    private val instanceHttpRequestStatisticsService = InstanceHttpRequestStatisticsService(
        instanceService,
        actuatorClientProvider,
        instanceAbilityService,
        cacheManager
    )

    @Test
    fun `getStatisticsByUriAndStatus should support returning non-status strings`() {
        val instance = stubInstance()
        val actuatorClientMock = actuatorClientProvider.provide(instance)
        whenever(instanceService.getInstanceFromCacheOrThrow(instance.id)).thenReturn(instance)
        val metricStub = Result.success(
            MetricActuatorResponse(
                InstanceHttpRequestStatisticsService.METRIC_NAME,
                null,
                null,
                listOf(
                    MetricActuatorResponse.Tag("status", listOf("UNKNOWN"))
                ),
                listOf(
                    MetricActuatorResponse.Measurement(
                        "COUNT",
                        0.0
                    ),
                    MetricActuatorResponse.Measurement(
                        "TOTAL_TIME",
                        0.0
                    ),
                    MetricActuatorResponse.Measurement(
                        "MAX",
                        0.0
                    ),
                )
            )
        )
        whenever(actuatorClientMock.metric(InstanceHttpRequestStatisticsService.METRIC_NAME, mapOf("uri" to "/test")))
            .thenReturn(metricStub)
        whenever(actuatorClientMock.metric(InstanceHttpRequestStatisticsService.METRIC_NAME, mapOf("uri" to "/test", "status" to "UNKNOWN")))
            .thenReturn(metricStub)
        instanceAbilityService.setAbilities(instance, setOf(InstanceAbility.HTTP_REQUEST_STATISTICS))

        val statistics = instanceHttpRequestStatisticsService.getStatisticsByUriAndStatus(instance.id, "/test")

        expectThat(statistics.size)
            .isEqualTo(1)
        expectThat(statistics.containsKey("UNKNOWN"))
            .isEqualTo(true)
    }
}