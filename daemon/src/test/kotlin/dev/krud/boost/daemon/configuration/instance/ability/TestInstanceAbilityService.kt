package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary

/**
 * This class is used to mock the InstanceAbilityService in tests.
 * Add the @TestInstanceAbilityService.Configure annotation to your test class to use it.
 * Once configured, you can autowire it in your test class and use the setAbilities method to set the abilities for a specific instance.
 */
class TestInstanceAbilityService : InstanceAbilityService {
    private val abilities = mutableMapOf<Instance, Set<InstanceAbility>>()

    fun setAbilities(instance: Instance, abilities: Set<InstanceAbility> = InstanceAbility.VALUES) {
        this.abilities[instance] = abilities
    }

    override fun getAbilities(instance: Instance): Set<InstanceAbility> {
        return abilities[instance] ?: emptySet()
    }

    @TestConfiguration
    class Configuration {
        @Bean
        @Primary
        fun testInstanceAbilityService(): TestInstanceAbilityService {
            return TestInstanceAbilityService()
        }
    }

    @Target(AnnotationTarget.CLASS)
    @Import(Configuration::class)
    annotation class Configure
}