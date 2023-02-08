package dev.krud.boost.daemon.configuration.application.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.stereotype.Component

@Component
class ApplicationToRoMappingDecorator : MappingDecorator<Application, ApplicationRO> {
    override fun decorate(context: MappingDecoratorContext<Application, ApplicationRO>) {
        context.to.effectiveColor = context.to.effectiveColor
    }
}