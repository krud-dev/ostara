package dev.krud.boost.daemon.configuration.folder.entity

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.crudframework.crud.annotation.Deleteable
import dev.krud.crudframework.crud.annotation.PersistCopyOnFetch
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import io.hypersistence.utils.hibernate.type.json.JsonType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Type
import java.util.*

@Entity
@DefaultMappingTarget(FolderRO::class)
@MappedField(mapFrom = "id")
@Deleteable(softDelete = false)
@PersistCopyOnFetch
class Folder(
    @MappedField
    @Column(nullable = false)
    var alias: String,
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
    var sort: Double? = null,
    @MappedField
    @Column(name = "parent_folder_id", nullable = true)
    var parentFolderId: UUID? = null,

    @MappedField
    @Type(JsonType::class)
    @Column(columnDefinition = "json")
    var authentication: Authentication = Authentication.Inherit.DEFAULT
) : AbstractEntity() {
    // TODO: change type to enum
    @Formula("(json_extract(authentication, '$.type'))")
    var authenticationType: String = authentication?.type ?: Authentication.Inherit.DEFAULT.type // Elvis is needed due to Hibernate

    companion object {
        const val NAME = "folder"
    }
}