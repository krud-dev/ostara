package dev.krud.boost.daemon.configuration.application.entity

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import org.hibernate.annotations.Formula
import java.util.*

@Entity
@DefaultMappingTarget(ApplicationRO::class)
@MappedField(mapFrom = "id")
class Application(
    @MappedField
    @Column(nullable = false)
    var alias: String,
    @MappedField
    @Column(nullable = true)
    @MappedField
    var description: String? = null,
    @MappedField
    var type: ApplicationType,
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
    var parentFolderId: UUID? = null,
) : AbstractEntity() {
    @MappedField
    @Formula("(select count(*) from instance i where i.parent_application_id = id)")
    val instanceCount: Int = 0
    companion object {
        const val NAME = "application"
    }
}

