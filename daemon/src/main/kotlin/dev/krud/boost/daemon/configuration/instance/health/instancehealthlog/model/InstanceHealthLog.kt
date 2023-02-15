package dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.model

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro.InstanceHealthLogRO
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import java.util.*

@Entity
@DefaultMappingTarget(InstanceHealthLogRO::class)
@MappedField(mapFrom = "creationTime")
@Deleteable(softDelete = false)
class InstanceHealthLog(
    @MappedField
    @Column(nullable = false)
    var instanceId: UUID,
    @MappedField
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) default 'UNKNOWN'")
    var status: InstanceHealthStatus = InstanceHealthStatus.UNKNOWN,
    @MappedField
    @Column(nullable = true)
    var statusText: String?
) : AbstractEntity()