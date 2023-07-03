package dev.krud.boost.daemon.agent.ro

import dev.krud.boost.daemon.configuration.authentication.Authentication
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.boost.daemon.utils.TypeDefaults
import java.util.*

class AgentRO(
    val id: UUID = TypeDefaults.UUID,
    val name: String = TypeDefaults.STRING,
    val url: String = TypeDefaults.STRING,
    var apiKey: String? = null,
    val color: String = DEFAULT_COLOR,
    val icon: String? = null,
    val sort: Double? = null,
    val parentFolderId: UUID? = null,
    val authentication: Authentication = Authentication.Inherit.DEFAULT
)
