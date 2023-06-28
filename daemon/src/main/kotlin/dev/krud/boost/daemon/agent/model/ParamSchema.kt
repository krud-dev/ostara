package dev.krud.boost.daemon.agent.model

data class ParamSchema(
    val name: String,
    val type: ParamType,
    val description: String = "The $name parameter",
    val required: Boolean = false,
    val defaultValue: String? = null,
    val validOptions: List<String>? = null
)