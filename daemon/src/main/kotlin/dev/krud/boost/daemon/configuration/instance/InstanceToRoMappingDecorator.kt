package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.stereotype.Component

@Component
class InstanceToRoMappingDecorator : MappingDecorator<Instance, InstanceRO> {
    override fun decorate(context: MappingDecoratorContext<Instance, InstanceRO>) {
        val actuatorClient = ActuatorHttpClient(context.from.actuatorUrl)
        context.to.endpoints = actuatorClient.endpoints()
    }
}