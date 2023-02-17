package dev.krud.boost.daemon.configuration

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationModifyRequestRO
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderModifyRequestRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro.InstanceHealthLogRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceModifyRequestRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import dev.krud.boost.daemon.eventlog.ro.EventLogRO
import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.spring.ShapeShiftAutoConfiguration
import dev.krud.shapeshift.spring.ShapeShiftBuilderCustomizer
import org.springframework.context.annotation.Configuration
import java.util.*

@Configuration
class ShapeshiftConfiguration : ShapeShiftBuilderCustomizer, ShapeShiftAutoConfiguration() {
    override fun customize(builder: ShapeShiftBuilder) {
        builder
            .withObjectSupplier { FolderModifyRequestRO("") }
            .withObjectSupplier { FolderRO(UUID.randomUUID(), "") }
            .withObjectSupplier { ApplicationModifyRequestRO("", ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { ApplicationRO(UUID.randomUUID(), "", ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { InstanceModifyRequestRO("", "", -1) }
            .withObjectSupplier { InstanceRO(UUID.randomUUID(), "", "", -1) }
            .withObjectSupplier { EventLogRO(UUID.randomUUID(), Date(), EventLogType.INSTANCE_HEALTH_CHANGED, EventLogSeverity.INFO, UUID.randomUUID()) }
            .withObjectSupplier { InstanceHealthLogRO(Date(), UUID.randomUUID()) }
    }
}