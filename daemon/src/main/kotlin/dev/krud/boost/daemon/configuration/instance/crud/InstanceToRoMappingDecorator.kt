package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
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
        val health = instanceHealthService.getCachedHealth(context.from.id)
        context.to.health = health
    }
}