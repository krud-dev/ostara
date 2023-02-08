package dev.krud.boost.daemon.configuration

import dev.krud.boost.daemon.configuration.application.dto.ApplicationModifyRequestDTO
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.folder.dto.FolderModifyRequestDTO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.configuration.instance.dto.InstanceModifyRequestDTO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.shapeshift.ShapeShift
import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.spring.ShapeShiftAutoConfiguration
import dev.krud.shapeshift.spring.ShapeShiftBuilderCustomizer
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
class ShapeshiftConfiguration : ShapeShiftBuilderCustomizer, ShapeShiftAutoConfiguration() {
    override fun customize(builder: ShapeShiftBuilder) {
        builder
            .withObjectSupplier { FolderModifyRequestDTO("") }
            .withObjectSupplier { FolderRO(UUID.randomUUID(), "") }
            .withObjectSupplier { ApplicationModifyRequestDTO("", ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { ApplicationRO(UUID.randomUUID(), "", ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { InstanceModifyRequestDTO("", "", -1) }
            .withObjectSupplier { InstanceRO(UUID.randomUUID(), "", "", -1) }
    }

}