package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import org.springframework.stereotype.Component

@Component
class InfoBuildAbilityResolverImpl : InfoAbilityResolver() {
    override val ability: InstanceAbility = InstanceAbility.INFO_BUILD

    override fun hasAbility(options: InstanceAbilityResolver.Options): Boolean {
        return super.hasAbility(options) &&
            options.actuatorClient.info().getOrNull()?.build != null
    }
}