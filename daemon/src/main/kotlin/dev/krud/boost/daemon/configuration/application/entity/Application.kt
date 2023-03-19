package dev.krud.boost.daemon.configuration.application.entity

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.*
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Type
import java.util.*

@Entity
@DefaultMappingTarget(ApplicationRO::class)
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
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
    @Column(nullable = false, columnDefinition = "varchar(30) default '$DEFAULT_COLOR'")
    var color: String = DEFAULT_COLOR,
    @MappedField
    @Column(nullable = true)
    var icon: String? = null,
    @MappedField
    @Column(nullable = true)
    var sort: Double? = null,
    @MappedField
    @Column(name = "parent_folder_id", nullable = true)
    var parentFolderId: UUID? = null,

    @MappedField
    @Type(JsonType::class)
    @Column(columnDefinition = "json")
    var authentication: Authentication = Authentication.Inherit.DEFAULT
) : AbstractEntity() {
    @MappedField
    @Formula("(select count(*) from instance i where i.parent_application_id = id)")
    var instanceCount: Int = 0

    companion object {
        const val NAME = "application"
    }
}