package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import java.util.*

class ApplicationRO(
    val id: UUID,
    val alias: String,
    var type: ApplicationType,
    var instanceCount: Int = 0,
    val description: String? = null,
    val color: String? = null,
    var effectiveColor: String? = null,
    val icon: String? = null,
    val sort: Int? = null,
    val parentFolderId: UUID? = null,
    var health: ApplicationHealthRO = ApplicationHealthRO.unknown()
)