package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import java.util.*

fun stubFolder(id: UUID = UUID.randomUUID(), alias: String = "stubFolder", authentication: Authentication = Authentication.Inherit.DEFAULT, parentFolderId: UUID? = null, sort: Double = 1.0): Folder {
    return Folder(alias, authentication = authentication, parentFolderId = parentFolderId, sort = sort).apply {
        this.id = id
    }
}