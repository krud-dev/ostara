package dev.krud.boost.daemon.configuration

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationModifyRequestRO
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderModifyRequestRO
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro.InstanceHealthLogRO
import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference
import dev.krud.boost.daemon.configuration.instance.heapdump.ro.InstanceHeapdumpReferenceRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceModifyRequestRO
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import dev.krud.boost.daemon.eventlog.ro.EventLogRO
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingLogRO
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingRequestRO
import dev.krud.boost.daemon.utils.TypeDefaults
import dev.krud.shapeshift.ShapeShiftBuilder
import dev.krud.shapeshift.spring.ShapeShiftAutoConfiguration
import dev.krud.shapeshift.spring.ShapeShiftBuilderCustomizer
import org.springframework.context.annotation.Configuration

@Configuration
class ShapeshiftConfiguration : ShapeShiftBuilderCustomizer, ShapeShiftAutoConfiguration() {
    override fun customize(builder: ShapeShiftBuilder) {
        builder
            .withObjectSupplier { FolderModifyRequestRO(TypeDefaults.STRING) }
            .withObjectSupplier { FolderRO(TypeDefaults.UUID, TypeDefaults.STRING) }
            .withObjectSupplier { ApplicationModifyRequestRO(TypeDefaults.STRING, ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { ApplicationRO(TypeDefaults.UUID, TypeDefaults.STRING, ApplicationType.SPRING_BOOT) }
            .withObjectSupplier { InstanceModifyRequestRO(TypeDefaults.STRING, TypeDefaults.STRING, TypeDefaults.UUID) }
            .withObjectSupplier { InstanceRO(TypeDefaults.UUID, TypeDefaults.STRING, null, null, TypeDefaults.STRING, TypeDefaults.UUID) }
            .withObjectSupplier { EventLogRO(TypeDefaults.UUID, TypeDefaults.DATE, EventLogType.INSTANCE_HEALTH_CHANGED, EventLogSeverity.INFO, TypeDefaults.UUID) }
            .withObjectSupplier { InstanceHealthLogRO(TypeDefaults.DATE, TypeDefaults.UUID) }
            .withObjectSupplier { InstanceHeapdumpReference(TypeDefaults.UUID) }
            .withObjectSupplier { InstanceHeapdumpReferenceRO(TypeDefaults.UUID, TypeDefaults.UUID, TypeDefaults.DATE) }
            .withObjectSupplier { ThreadProfilingRequest(TypeDefaults.UUID, TypeDefaults.INT, ThreadProfilingStatus.RUNNING) }
            .withObjectSupplier { ThreadProfilingRequestRO(TypeDefaults.UUID, TypeDefaults.DATE, TypeDefaults.UUID, TypeDefaults.INT, TypeDefaults.DATE, ThreadProfilingStatus.RUNNING) }
            .withObjectSupplier { ThreadProfilingLogRO(TypeDefaults.UUID, TypeDefaults.DATE, TypeDefaults.UUID) }
    }
}