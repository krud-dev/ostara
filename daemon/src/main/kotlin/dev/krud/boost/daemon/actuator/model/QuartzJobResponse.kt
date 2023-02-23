package dev.krud.boost.daemon.actuator.model

import java.util.*

data class QuartzJobResponse(
    val group: String,
    val name: String,
    val description: String,
    val className: String,
    val durable: Boolean,
    val requestRecovery: Boolean,
    val data: Map<String, String>,
    val triggers: List<Trigger>
) {
    data class Trigger(
        val group: String,
        val name: String,
        val previousFireTime: Date?,
        val nextFireTime: Date?,
        val priority: Int
    )
}