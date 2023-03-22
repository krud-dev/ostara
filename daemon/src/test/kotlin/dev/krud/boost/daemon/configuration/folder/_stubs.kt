package dev.krud.boost.daemon.configuration.folder

import dev.krud.boost.daemon.configuration.folder.entity.Folder
import java.util.*

fun stubFolder(id: UUID = UUID.randomUUID(), alias: String = "stubFolder"): Folder {
    return Folder(alias).apply {
        this.id = id
    }
}