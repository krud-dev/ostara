package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.jackson.ParsedDate
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import strikt.assertions.isFalse
import strikt.assertions.isTrue
import java.util.*

class InfoGitAbilityResolverImplTest {
    private val resolver = InfoGitAbilityResolverImpl()

    @Test
    fun `ability should be INFO_GIT`() {
        expectThat(
            resolver.ability
        ).isEqualTo(
            InstanceAbility.INFO_GIT
        )
    }

    @Test
    fun `resolver should return true if build info exists`() {
        val client = mock<ActuatorHttpClient>()
        whenever(client.info()).thenReturn(
            Result.success(
                InfoActuatorResponse(
                    git = InfoActuatorResponse.Git.Simple(
                        branch = "master",
                        commit = InfoActuatorResponse.Git.Simple.Commit(
                            id = "abcdefg",
                            time = ParsedDate(Date(0))
                        )
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