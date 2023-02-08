package dev.krud.boost.daemon.configuration.folder.ro

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import jakarta.validation.constraints.NotBlank
import java.util.*

@DefaultMappingTarget(Folder::class)
data class FolderModifyRequestRO(
  @MappedField
  @NotBlank
  val alias: String,
  @MappedField
  val description: String? = null,
  @MappedField
  val color: String? = null,
  @MappedField
  val icon: String? = null,
  @MappedField
  val sort: Int? = null,
  @MappedField
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
