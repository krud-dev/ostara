package dev.krud.boost.daemon.configuration.folder.entity

import dev.krud.boost.daemon.configuration.folder.ro.FolderRO
import dev.krud.boost.daemon.entity.AbstractEntity
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import java.util.*

@Entity
@DefaultMappingTarget(FolderRO::class)
@MappedField(mapFrom = "id")
class Folder(
    @MappedField
    @Column(nullable = false)
    var alias: String,
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
    @Column(name = "parent_folder_id", nullable = true)
    var parentFolderId: UUID? = null
) : AbstractEntity() {
    @ManyToOne
    @JoinColumn(name = "parent_folder_id", insertable = false, updatable = false, nullable = true)
    val parentFolder: Folder? = null

    companion object {
        const val NAME = "folder"
        val Folder.effectiveColor: String?
            get() = color ?: parentFolder?.effectiveColor
    }
}