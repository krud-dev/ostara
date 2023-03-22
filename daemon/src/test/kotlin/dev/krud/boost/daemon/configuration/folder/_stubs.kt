package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.configuration.folder.entity.Folder
import java.util.*

fun stubFolder(id: UUID = UUID.randomUUID(), alias: String = "stubFolder", authentication: Authentication = Authentication.Inherit.DEFAULT, parentFolderId: UUID? = null): Folder {
    return Folder(alias, authentication = authentication, parentFolderId = parentFolderId).apply {
        this.id = id
    }
}