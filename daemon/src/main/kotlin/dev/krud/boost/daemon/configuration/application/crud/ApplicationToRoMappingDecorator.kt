package dev.krud.boost.daemon.configuration.application.crud

import dev.krud.boost.daemon.configuration.application.ApplicationHealthService
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Component

@Component
class ApplicationToRoMappingDecorator(
    @Lazy
    private val applicationHealthService: ApplicationHealthService
) : MappingDecorator<Application, ApplicationRO> {
    override fun decorate(context: MappingDecoratorContext<Application, ApplicationRO>) {
        val health = applicationHealthService.getHealth(context.from.id)
        context.to.health = health
    }
}