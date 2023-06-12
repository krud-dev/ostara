package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Component

@Component
class InfoGitAbilityResolverImpl : InfoAbilityResolver() {
    override val ability: InstanceAbility = InstanceAbility.INFO_GIT

    override fun hasAbility(options: InstanceAbilityResolver.Options): Boolean {
        return super.hasAbility(options) &&
            options.actuatorClient.info().getOrNull()?.git != null
    }
}