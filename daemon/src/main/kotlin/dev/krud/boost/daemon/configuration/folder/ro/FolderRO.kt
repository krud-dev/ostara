package dev.krud.boost.daemon.configuration.folder.ro

import java.util.*


class FolderRO(
    val id: UUID,
    val alias: String,
    val description: String? = null,
    val color: String? = null,
    var effectiveColor: String? = null,
    val icon: String? = null,
    val sort: Int? = null,
    val parentFolderId: UUID? = null,
)

