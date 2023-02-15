package dev.krud.boost.daemon.configuration.folder.ro

import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import java.util.*

class FolderRO(
    val id: UUID,
    val alias: String,
    val description: String? = null,
    val color: String = DEFAULT_COLOR,
    var effectiveColor: String = DEFAULT_COLOR,
    val icon: String? = null,
    val sort: Int? = null,
    val parentFolderId: UUID? = null
)