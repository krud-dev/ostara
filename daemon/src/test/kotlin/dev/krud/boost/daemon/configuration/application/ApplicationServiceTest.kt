package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.test.TestKrud
import dev.krud.crudframework.crud.handler.krud.Krud
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import org.mockito.kotlin.whenever
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.integration.channel.PublishSubscribeChannel
import strikt.api.expectThat
import strikt.assertions.isEqualTo
import java.util.*

class ApplicationServiceTest {
    private val applicationKrud: Krud<Application, UUID> = TestKrud(Application::class.java) { UUID.randomUUID() }
    private val instanceKrud: Krud<Instance, UUID> = TestKrud(Instance::class.java) { UUID.randomUUID() }
    private val instanceAbilityService: InstanceAbilityService = mock()
    private val systemEventsChannel: PublishSubscribeChannel = mock()
    private val applicationService = ApplicationService(
        applicationKrud,
        instanceKrud,
        instanceAbilityService,
        systemEventsChannel,
        ConcurrentMapCacheManager("applicationDisableSslVerificationCache")
    )

    @Test
    fun `getApplicationAbilities happy flow should return subset of application abilities by instance`() {
        val application = applicationKrud.create(
            stubApplication()
        )
        val firstChild = instanceKrud.create(
            stubInstance(parentApplicationId = application.id)
        )
        val secondChild = instanceKrud.create(
            stubInstance(parentApplicationId = application.id)
        )

        whenever(instanceAbilityService.getAbilities(firstChild)).thenReturn(
            setOf(
                InstanceAbility.CACHES,
                InstanceAbility.CACHE_STATISTICS,
                InstanceAbility.HEALTH,
                InstanceAbility.METRICS,
                InstanceAbility.SHUTDOWN
            )
        )

        whenever(instanceAbilityService.getAbilities(secondChild)).thenReturn(
            setOf(
                InstanceAbility.LOGGERS,
                InstanceAbility.METRICS,
                InstanceAbility.SHUTDOWN
            )
        )

        val abilities = applicationService.getAbilities(
            application.id
        )

        expectThat(abilities).isEqualTo(
            setOf(
                InstanceAbility.CACHES,
                InstanceAbility.CACHE_STATISTICS,
                InstanceAbility.LOGGERS
            )
        )
    }
}