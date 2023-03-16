package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import java.util.*

class ApplicationRO(
    val id: UUID,
    val alias: String,
    var type: ApplicationType,
    var instanceCount: Int = 0,
    val description: String? = null,
    val color: String = DEFAULT_COLOR,
    val icon: String? = null,
    val sort: Double? = null,
    val parentFolderId: UUID? = null,
    var health: ApplicationHealthRO = ApplicationHealthRO.unknown(),
    var authentication: Authentication = Authentication.Inherit.DEFAULT,
)