package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class BeansActuatorResponse(
    val contexts: Map<String, Context> = emptyMap()
) {
    data class Context(
        val beans: Map<String, Bean> = emptyMap(),
        val parentId: String? = null
    ) {
        data class Bean(
            val aliases: List<String> = emptyList(),
            val scope: String = TypeDefaults.STRING,
            val type: String = TypeDefaults.STRING,
            val resource: String? = null,
            val dependencies: List<String> = emptyList()
        )
    }
}