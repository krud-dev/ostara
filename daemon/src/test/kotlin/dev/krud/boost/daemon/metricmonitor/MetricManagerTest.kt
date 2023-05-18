package dev.krud.boost.daemon.metricmonitor

import dev.krud.boost.daemon.actuator.model.MetricActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.TestInstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.metricmonitor.messaging.InstanceMetricUpdatedMessage
import dev.krud.boost.daemon.utils.ParsedMetricName
import io.micrometer.core.instrument.MeterRegistry
import io.micrometer.core.instrument.simple.SimpleMeterRegistry
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.context.junit.jupiter.SpringExtension
import strikt.api.expect
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo
import java.util.*

@ExtendWith(SpringExtension::class)
@ContextConfiguration(classes = [MetricManager::class, MetricManagerTest.Config::class])
@TestInstanceActuatorClientProvider.Configure
class MetricManagerTest {
    @Autowired
    private lateinit var metricManager: MetricManager

    @MockBean
    private lateinit var instanceService: InstanceService

    @MockBean
    private lateinit var instanceMetricUpdatedChannel: PublishSubscribeChannel

    @Autowired
    private lateinit var actuatorClientProvider: InstanceActuatorClientProvider

    @Configuration
    internal class Config {
        @Bean
        fun meterRegistry(): MeterRegistry = SimpleMeterRegistry()
    }

    @Test
    fun `request metric should add a metric request`() {
        val metricName = ParsedMetricName.from("some.data[VALUE]?someKey=someValue")
        val instance = stubInstance()
        metricManager.requestMetric(instance.id, metricName)
        expect {
            that(metricManager.getInstanceRequests(instance.id)).hasSize(1)
            that(metricManager.getInstanceRequests(instance.id).first().metricName).isEqualTo(metricName)
        }
    }

    @Test
    fun `release metric should remove a metric request`() {
        val metricName = ParsedMetricName.from("some.data[VALUE]?someKey=someValue")
        val instance = stubInstance()
        metricManager.requestMetric(instance.id, metricName)
        metricManager.releaseMetric(instance.id, metricName)
        expect {
            that(metricManager.getInstanceRequests(instance.id)).hasSize(0)
        }
    }

    @Test
    fun `release all metrics should remove all metric requests`() {
        val metricName = ParsedMetricName.from("some.data[VALUE]?someKey=someValue")
        val metricName2 = ParsedMetricName.from("some.data[VALUE]?someKey=someValue2")
        val instance = stubInstance()
        metricManager.requestMetric(instance.id, metricName)
        metricManager.requestMetric(instance.id, metricName2)
        metricManager.releaseAllMetrics(instance.id)
        expect {
            that(metricManager.getInstanceRequests(instance.id)).hasSize(0)
        }
    }

    @Test
    fun `requested metric should be updated on fetch`() {
        val metricName = ParsedMetricName.from("some.data[VALUE]?someKey=someValue")
        val instance = stubInstance()
        whenever(instanceService.getInstanceFromCache(instance.id)).thenReturn(instance)
        val client = actuatorClientProvider.provide(instance)
        whenever(client.metric(metricName.name, mapOf("someKey" to "someValue"))).thenReturn(
            metricName.stubResponse(5.0)
        )
        metricManager.requestMetric(instance.id, metricName)
        metricManager.fetchMetrics()
        whenever(client.metric(metricName.name, mapOf("someKey" to "someValue"))).thenReturn(
            metricName.stubResponse(6.0)
        )
        metricManager.fetchMetrics()
        metricManager.fetchMetrics()
        metricManager.releaseMetric(instance.id, metricName)
        val latestMetric = metricManager.getLatestMetric(instance.id, metricName)
        expect {
            that(latestMetric!!.value.value).isEqualTo(6.0)
        }
        val messageCaptor = argumentCaptor<InstanceMetricUpdatedMessage>()
        verify(instanceMetricUpdatedChannel, times(1)).send(messageCaptor.capture())
        val message = messageCaptor.firstValue
        expect {
            that(message.payload.instanceId).isEqualTo(instance.id)
            that(message.payload.metricName).isEqualTo(metricName)
            that(message.payload.oldValue!!.value.value).isEqualTo(5.0)
            that(message.payload.newValue!!.value.value).isEqualTo(6.0)
        }

    }

    private fun ParsedMetricName.stubResponse(value: Double): Result<MetricActuatorResponse> {
        return Result.success(
            MetricActuatorResponse(
                this.name,
                "description",
                null,
                emptyList(),
                listOf(
                    MetricActuatorResponse.Measurement(
                        this.statistic,
                        value
                    )
                )
            )
        )
    }
}