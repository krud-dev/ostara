package dev.krud.boost.daemon.configuration.instance.entity

import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import java.util.*

@Entity
@DefaultMappingTarget(InstanceRO::class)
@MappedField(mapFrom = "id")
class Instance(
    @MappedField
    @Column(nullable = false)
    var alias: String,
    @MappedField
    @Column(nullable = false)
    var actuatorUrl: String,
    @MappedField
    @Column(nullable = false, columnDefinition = "int default 5")
    var dataCollectionIntervalSeconds: Int = 5,
    @MappedField
    @Column(nullable = true)
    @MappedField
    var description: String? = null,
    @MappedField
    @Column(nullable = true)
    var color: String? = null,
    @MappedField
    @Column(nullable = true)
    var icon: String? = null,
    @MappedField
    @Column(nullable = true)
    var sort: Int? = null,
    @MappedField
    @Column(nullable = true)
    var parentApplicationId: UUID? = null
) : AbstractEntity() {
    companion object {
        const val NAME = "application"
    }
}

