package dev.krud.boost.daemon.configuration

import dev.krud.boost.daemon.configuration.folder.dto.FolderModifyRequestDTO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.shapeshift.ShapeShift
import dev.krud.shapeshift.ShapeShiftBuilder
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
class ShapeshiftConfiguration {
    @Bean
    fun shapeShift(): ShapeShift {
        return ShapeShiftBuilder()
            .withObjectSupplier { FolderModifyRequestDTO("") }
            .withObjectSupplier { FolderRO(UUID.randomUUID(), "") }
            .build()
    }
}