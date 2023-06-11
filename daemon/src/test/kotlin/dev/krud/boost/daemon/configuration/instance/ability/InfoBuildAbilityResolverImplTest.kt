package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.stubInstance
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isFalse
import strikt.assertions.isTrue

class InfoBuildAbilityResolverImplTest {
    private val resolver = InfoBuildAbilityResolverImpl()

    @Test
    fun `ability should be INFO_BUILD`() {
        expectThat(
            resolver.ability
        ).isEqualTo(
            InstanceAbility.INFO_BUILD
        )
    }

    @Test
    fun `resolver should return true if build info exists`() {
        val client = mock<ActuatorHttpClient>()
        whenever(client.info()).thenReturn(
            Result.success(
                InfoActuatorResponse(
                    build = InfoActuatorResponse.Build(
                        version = "1.0.0"
                    )
                )
            )
        )
        val instance = stubInstance()
        val options = InstanceAbilityResolver.Options(
            instance,
            setOf("info"),
            client
        )
        val result = resolver.hasAbility(options)
        expectThat(result).isTrue()
    }

    @Test
    fun `resolver should return false if build info does not exist`() {
        val client = mock<ActuatorHttpClient>()
        whenever(client.info()).thenReturn(
            Result.success(
                InfoActuatorResponse()
            )
        )
        val instance = stubInstance()
        val options = InstanceAbilityResolver.Options(
            instance,
            setOf("info"),
            client
        )
        val result = resolver.hasAbility(options)
        expectThat(result).isFalse()
    }
}