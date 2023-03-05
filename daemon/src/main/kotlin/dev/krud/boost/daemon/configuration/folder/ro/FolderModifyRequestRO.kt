package dev.krud.boost.daemon.configuration.folder.ro

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.configuration.folder.validation.ValidFolderIdOrNull
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(Folder::class)
data class FolderModifyRequestRO(
    @MappedField
    @get:NotBlank
    val alias: String,
    @MappedField
    val color: String = DEFAULT_COLOR,
    @MappedField
    val authentication: Authentication = Authentication.Inherit.DEFAULT,
    @MappedField
    val description: String? = null,
    @MappedField
    val icon: String? = null,
    @MappedField
    val sort: Double? = null,
    @MappedField
    @get:ValidFolderIdOrNull
    val parentFolderId: UUID? = null
) {
    companion object {
        fun FolderModifyRequestRO.toFolder(id: UUID? = null): Folder {
            return Folder(
                alias = alias,
                description = description,
                color = color,
                icon = icon,
                sort = sort,
                parentFolderId = parentFolderId
            ).apply {
                if (id != null) {
                    this.id = id
                }
            }
        }

        fun Folder.toModifyFolderRequestDTO(): FolderModifyRequestRO {
            return FolderModifyRequestRO(
                alias = alias,
                description = description,
                color = color,
                icon = icon,
                sort = sort,
                parentFolderId = parentFolderId
            )
        }
    }
}