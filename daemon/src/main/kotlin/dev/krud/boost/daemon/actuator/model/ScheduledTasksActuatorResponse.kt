package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class ScheduledTasksActuatorResponse(
    val cron: List<Cron> = emptyList(),
    val fixedDelay: List<FixedDelayOrRate> = emptyList(),
    val fixedRate: List<FixedDelayOrRate> = emptyList(),
    val custom: List<Custom> = emptyList()
) {
    data class Cron(
        val runnable: Runnable = Runnable(),
        val expression: String = TypeDefaults.STRING
    )

    data class FixedDelayOrRate(
        val runnable: Runnable = Runnable(),
        val initialDelay: Long = TypeDefaults.LONG,
        val interval: Long = TypeDefaults.LONG
    )

    data class Custom(
        val runnable: Runnable = Runnable(),
        val trigger: String = TypeDefaults.STRING
    )

    data class Runnable(
        val target: String = TypeDefaults.STRING
    )
}