package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.utils.stripEverythingAfterLastSlash
import dev.krud.boost.daemon.utils.stripHttpProtocolIfPresent
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class InstanceToRoMappingDecorator(
    @Lazy
    private val instanceHealthService: InstanceHealthService
) : MappingDecorator<Instance, InstanceRO> {
    override fun decorate(context: MappingDecoratorContext<Instance, InstanceRO>) {
        context.from.alias?.let {
            context.to.displayName = it
        }

        val health = instanceHealthService.getCachedHealth(context.from.id)
        context.to.health = health
        context.to.displayName = if (!context.from.alias.isNullOrBlank()) {
            context.from.alias!!
        } else {
            context.from.hostname
                ?: context.from.actuatorUrl
                    .stripHttpProtocolIfPresent()
                    .stripEverythingAfterLastSlash()
        }
    }
}