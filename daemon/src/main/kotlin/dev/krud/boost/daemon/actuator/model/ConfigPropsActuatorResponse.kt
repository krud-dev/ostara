package dev.krud.boost.daemon.actuator.model

data class ConfigPropsActuatorResponse(
    val contexts: Map<String, Context>
) {
    data class Context(
        val beans: Map<String, Bean>,
        val parentId: String?
    ) {
        data class Bean(
            val prefix: String,
            val properties: Map<String, Any>,
            val inputs: Map<String, Any>
        )
    }
}