package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.entity.Instance.Companion.effectiveAuthentication
import dev.krud.boost.daemon.configuration.instance.entity.Instance.Companion.effectiveColor
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.hostname.InstanceHostnameResolver
import dev.krud.boost.daemon.configuration.instance.info.InstanceInformationService
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.utils.stripHttpProtocolIfPresent
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class InstanceToRoMappingDecorator(
    @Lazy
    private val instanceHealthService: InstanceHealthService,
    @Lazy
    private val instanceHostnameResolver: InstanceHostnameResolver,
    @Lazy
    private val instanceAbilityService: InstanceAbilityService,
    @Lazy
    private val instanceInformationService: InstanceInformationService
) : MappingDecorator<Instance, InstanceRO> {
    override fun decorate(context: MappingDecoratorContext<Instance, InstanceRO>) {
        context.to.effectiveColor = context.from.effectiveColor
        context.from.alias?.let {
            context.to.displayName = it
        }

        val health = instanceHealthService.getHealth(context.from.id)
        context.to.health = health
        if (health.status.running) {
            context.to.abilities = instanceAbilityService.resolveAbilities(context.from)
            context.to.hostname = instanceHostnameResolver.resolveHostname(context.from.id)
        }

        if (context.from.alias.isNullOrBlank()) {
            context.to.displayName = context.to.hostname
                ?: context.from.actuatorUrl
                    .stripHttpProtocolIfPresent()
        } else {
            context.to.displayName = context.from.alias!!
        }

        context.to.effectiveAuthentication = context.from.effectiveAuthentication
        context.to.activeProfiles = instanceInformationService.getInstanceActiveProfiles(context.from.id)
    }
}