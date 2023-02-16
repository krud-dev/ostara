package dev.krud.boost.daemon.configuration.instance.entity

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.entity.Application.Companion.effectiveColor
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import java.util.*

@Entity
@DefaultMappingTarget(InstanceRO::class)
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
class Instance(
    @MappedField
    @Column(nullable = false)
    var alias: String,
    @MappedField
    @Column(nullable = false)
    var actuatorUrl: String,
    @MappedField
    @Column(name = "parent_application_id", nullable = false)
    var parentApplicationId: UUID,
    @MappedField
    @Column(nullable = false, columnDefinition = "int default 5")
    var dataCollectionIntervalSeconds: Int = 5,
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
    @ManyToOne
    @JoinColumn(name = "parent_application_id", insertable = false, updatable = false, nullable = false)
    val parentApplication: Application? = null

    companion object {
        const val NAME = "application"
        val Instance.effectiveColor: String
            get() {
                if (color != DEFAULT_COLOR) {
                    return color
                }
                return parentApplication?.effectiveColor ?: DEFAULT_COLOR
            }
    }
}