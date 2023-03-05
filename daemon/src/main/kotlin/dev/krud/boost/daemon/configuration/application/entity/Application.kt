package dev.krud.boost.daemon.configuration.application.entity

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.authentication.EffectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.entity.Folder.Companion.effectiveAuthentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder.Companion.effectiveColor
import dev.krud.boost.daemon.configuration.instance.entity.Instance
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
    val instanceCount: Int = 0

    @ManyToOne
    @JoinColumn(name = "parent_folder_id", insertable = false, updatable = false, nullable = true)
    val parentFolder: Folder? = null

    @OneToMany(mappedBy = "parentApplication", fetch = FetchType.EAGER)
    val instances: List<Instance> = listOf()

    companion object {
        const val NAME = "application"
        val Application.effectiveColor: String
            get() {
                if (color != DEFAULT_COLOR) {
                    return color
                }
                return parentFolder?.effectiveColor ?: DEFAULT_COLOR
            }
        val Application.effectiveAuthentication: EffectiveAuthentication
            get() {
                if (authentication !is Authentication.Inherit) {
                    return EffectiveAuthentication(authentication, EffectiveAuthentication.SourceType.APPLICATION, id)
                }
                return parentFolder?.effectiveAuthentication
                    ?: EffectiveAuthentication(Authentication.None.DEFAULT, EffectiveAuthentication.SourceType.APPLICATION, id)
            }
        val Application.healthyInstances get() = instances
    }
}