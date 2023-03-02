package dev.krud.boost.daemon.threadprofiling.model

import dev.krud.boost.daemon.actuator.model.ThreadDumpActuatorResponse
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingLogRO
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import org.hibernate.annotations.Type
import java.util.*

@Entity
@DefaultMappingTarget(ThreadProfilingLogRO::class)
@MappedField(mapFrom = "id")
@MappedField(mapFrom = "creationTime")
class ThreadProfilingLog(
    @MappedField
    @Column(name = "request_id", nullable = false)
    var requestId: UUID,

    @MappedField
    @Type(JsonType::class)
    @Column(columnDefinition = "json")
    var thread: ThreadDumpActuatorResponse.Thread
) : AbstractEntity()