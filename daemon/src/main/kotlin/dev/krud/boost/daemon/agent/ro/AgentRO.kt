package dev.krud.boost.daemon.agent.ro

import dev.krud.boost.daemon.utils.TypeDefaults
import java.util.*

class AgentRO(
    val id: UUID = TypeDefaults.UUID,
    val name: String = TypeDefaults.STRING,
    val url: String = TypeDefaults.STRING,
    var apiKey: String? = null
)
