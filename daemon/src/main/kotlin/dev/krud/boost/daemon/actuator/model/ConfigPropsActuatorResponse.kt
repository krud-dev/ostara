package dev.krud.boost.daemon.actuator.model

data class ConfigPropsActuatorResponse(
    val contexts: Map<String, Context> = emptyMap()
) {
    data class Context(
        val beans: Map<String, Bean> = emptyMap(),
        val parentId: String? = null
    ) {
        data class Bean(
            val prefix: String? = null,
            val properties: Map<String, Any>? = null,
            val inputs: Map<String, Any>? = null
        )
    }
}