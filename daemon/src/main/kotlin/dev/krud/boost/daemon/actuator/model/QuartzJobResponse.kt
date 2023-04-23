package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class QuartzJobResponse(
    val group: String = TypeDefaults.STRING,
    val name: String = TypeDefaults.STRING,
    val description: String = TypeDefaults.STRING,
    val className: String = TypeDefaults.STRING,
    val durable: Boolean = TypeDefaults.BOOLEAN,
    val requestRecovery: Boolean = TypeDefaults.BOOLEAN,
    val data: Map<String, Any> = emptyMap(),
    val triggers: List<Trigger> = emptyList()
) {
    data class Trigger(
        val group: String = TypeDefaults.STRING,
        val name: String = TypeDefaults.STRING,
        val previousFireTime: ParsedDate? = null,
        val nextFireTime: ParsedDate? = null,
        val priority: Int = TypeDefaults.INT
    )
}