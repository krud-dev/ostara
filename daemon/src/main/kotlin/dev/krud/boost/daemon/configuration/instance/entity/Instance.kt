package dev.krud.boost.daemon.configuration.instance.entity

import dev.krud.boost.daemon.configuration.instance.hostname.model.InstanceHostname
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.crudframework.crud.annotation.PersistCopyOnFetch
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.OneToOne
import org.hibernate.annotations.Formula
import java.util.*

@Entity
@DefaultMappingTarget(InstanceRO::class)
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
@PersistCopyOnFetch
class Instance(
    @MappedField
    @Column(nullable = true)
    var alias: String?,
    @MappedField
    @Column(nullable = false)
    var actuatorUrl: String,
    @MappedField
    @Column(name = "parent_application_id", nullable = false)
    var parentApplicationId: UUID,
    @MappedField
    @Column(nullable = true)
    @MappedField
    var description: String? = null,
    @MappedField
    @Column(nullable = false, columnDefinition = "varchar(30) default '$DEFAULT_COLOR'")
    var color: String = DEFAULT_COLOR,
    @MappedField
    @Column(nullable = true)
    var icon: String? = null,
    @MappedField
    @Column(nullable = true)
    var sort: Double? = null
) : AbstractEntity() {
    @MappedField(mapFrom = "hostname")
    @OneToOne(cascade = [CascadeType.ALL], mappedBy = "instance")
    var hostname: InstanceHostname = InstanceHostname(this, null)

    @MappedField
    @Column(columnDefinition = "boolean default false")
    var demo: Boolean = false

    @MappedField
    @Column(nullable = true)
    var parentAgentId: UUID? = null

    @MappedField
    @Column(nullable = true)
    var agentExternalId: String? = null

    @MappedField
    @Formula("(agent_external_id is not null)")
    val discovered: Boolean = false

    companion object {
        const val NAME = "instance"
    }
}