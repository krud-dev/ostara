package dev.krud.boost.daemon.actuator.model

data class BeansActuatorResponse(
    val contexts: Map<String, Context>
) {
    data class Context(
        val beans: Map<String, Bean>,
        val parentId: String?
    ) {
        data class Bean(
            val aliases: List<String>,
            val scope: String,
            val type: String,
            val resource: String?,
            val dependencies: List<String>
        )
    }
}

