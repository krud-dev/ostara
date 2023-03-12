package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import java.util.*

fun stubFolder(
    id: UUID = UUID.randomUUID(),
    alias: String = "test",
    description: String? = null,
    color: String = DEFAULT_COLOR,
    icon: String? = null,
    sort: Double? = null,
    parentFolderId: UUID? = null,
    authentication: Authentication = Authentication.Inherit.DEFAULT
) = Folder(alias, description, color, icon, sort, parentFolderId, authentication).apply {
    this.id = id
}