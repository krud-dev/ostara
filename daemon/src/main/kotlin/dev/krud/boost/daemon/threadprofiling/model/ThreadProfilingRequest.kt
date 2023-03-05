package dev.krud.boost.daemon.threadprofiling.model

import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingRequestRO
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.util.*

@Entity
@DefaultMappingTarget(ThreadProfilingRequestRO::class)
@MappedField(mapFrom = "id")
@MappedField(mapFrom = "creationTime")
@Deleteable(softDelete = false)
class ThreadProfilingRequest(
    @MappedField
    @Column(name = "instance_id", nullable = false)
    var instanceId: UUID,
    @MappedField
    @Column
    var durationSec: Int,
    @MappedField
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(15) default 'RUNNING'")
    var status: ThreadProfilingStatus = ThreadProfilingStatus.RUNNING
) : AbstractEntity() {
    @MappedField
    @Column
    lateinit var finishTime: Date
}