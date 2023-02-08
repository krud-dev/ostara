package dev.krud.boost.daemon.configuration.folder.crud

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.shapeshift.decorator.MappingDecorator
import dev.krud.shapeshift.decorator.MappingDecoratorContext
import org.springframework.stereotype.Component

@Component
class FolderToRoMappingDecorator : MappingDecorator<Folder, FolderRO> {
    override fun decorate(context: MappingDecoratorContext<Folder, FolderRO>) {
        context.to.effectiveColor = context.to.effectiveColor
    }
}