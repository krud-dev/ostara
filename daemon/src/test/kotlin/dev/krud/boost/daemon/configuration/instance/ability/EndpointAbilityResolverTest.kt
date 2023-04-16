package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.DynamicTest
import org.junit.jupiter.api.DynamicTest.dynamicTest
import org.junit.jupiter.api.TestFactory
import org.mockito.kotlin.mock
import strikt.api.expectThat
import strikt.assertions.isFalse
import strikt.assertions.isTrue

class EndpointAbilityResolverTest {
    private val classesToCheck = listOf(
        { BeansAbilityResolver() to "beans" },
        { CachesAbilityResolver() to "caches" },
        { EnvAbilityResolver() to "env" },
        { FlywayAbilityResolver() to "flyway" },
        { HealthAbilityResolver() to "health" },
        { HeapDumpAbilityResolver() to "heapdump" },
        { InfoAbilityResolver() to "info" },
        { IntegrationGraphAbilityResolver() to "integrationgraph" },
        { LiquibaseAbilityResolver() to "liquibase" },
        { LoggersAbilityResolver() to "loggers" },
        { MappingsAbilityResolver() to "mappings" },
        { MetricsAbilityResolver() to "metrics" },
        { PropertiesAbilityResolver() to "configprops" },
        { QuartzAbilityResolver() to "quartz" },
        { RefreshAbilityResolver() to "refresh" },
        { ScheduledTasksAbilityResolver() to "scheduledtasks" },
        { ShutdownAbilityResolver() to "shutdown" },
        { ThreadDumpAbilityResolver() to "threaddump" }
    )

    @TestFactory
    fun `resolver should return true if endpoint is present`(): Iterator<DynamicTest> {
        return classesToCheck
            .map { it() }
            .map { (resolver, endpoint) ->
                dynamicTest("${resolver::class.simpleName} should return true if endpoint $endpoint is present") {
                    val options = InstanceAbilityResolver.Options(
                        stubInstance(),
                        setOf(endpoint),
                        mock()
                    )

                    val hasAbility = resolver.hasAbility(options)
                    expectThat(hasAbility)
                        .isTrue()
                }
            }.iterator()
    }

    @TestFactory
    fun `resolver should return false if endpoint is not present`(): Iterator<DynamicTest> {
        return classesToCheck
            .map { it() }
            .map { (resolver, endpoint) ->
                dynamicTest("${resolver::class.simpleName} should return false if endpoint $endpoint is not present") {
                    val options = InstanceAbilityResolver.Options(
                        stubInstance(),
                        setOf(),
                        mock()
                    )

                    val hasAbility = resolver.hasAbility(options)
                    expectThat(hasAbility)
                        .isFalse()
                }
            }.iterator()
    }
}