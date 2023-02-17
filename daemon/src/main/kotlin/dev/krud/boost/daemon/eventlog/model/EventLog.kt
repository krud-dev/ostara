package dev.krud.boost.daemon.eventlog.model

import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import dev.krud.boost.daemon.eventlog.ro.EventLogRO
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.util.*

@Entity
@DefaultMappingTarget(EventLogRO::class)
@MappedField(mapFrom = "id")
@MappedField(mapFrom = "creationTime")
@Deleteable(softDelete = false)
class EventLog(
    @MappedField
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    var type: EventLogType,
    @MappedField
    @Column(name = "target_id", nullable = false)
    var targetId: UUID,
    @MappedField
    @Column(nullable = true)
    var message: String?,
    @MappedField
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(10) default 'INFO'")
    var severity: EventLogSeverity = EventLogSeverity.INFO
) : AbstractEntity()