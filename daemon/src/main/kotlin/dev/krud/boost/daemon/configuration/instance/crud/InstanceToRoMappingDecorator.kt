package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class InstanceToRoMappingDecorator(
    @Lazy
    private val instanceService: InstanceService,
    @Lazy
    private val instanceHealthService: InstanceHealthService
) : MappingDecorator<Instance, InstanceRO> {
    override fun decorate(context: MappingDecoratorContext<Instance, InstanceRO>) {
        val actuatorClient = ActuatorHttpClient(context.from.actuatorUrl)
        context.to.effectiveColor = context.to.effectiveColor
        val health = instanceHealthService.getHealth(context.from.id)
        context.to.health = health
        if (health.status.running) {
            context.to.endpoints = actuatorClient.endpoints()
            context.to.abilities = instanceService.resolveAbilities(context.from)
        }
    }
}