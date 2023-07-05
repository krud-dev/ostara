package dev.krud.boost.daemon.agent.ro

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.utils.TypeDefaults
import jakarta.validation.constraints.NotBlank

@GenerateTypescript
data class AgentGetInfoRequestDTO(
    @field:NotBlank
    val url: String = TypeDefaults.STRING,
    val apiKey: String? = null
)