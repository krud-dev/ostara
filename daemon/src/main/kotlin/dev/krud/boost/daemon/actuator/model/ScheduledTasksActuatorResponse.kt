package dev.krud.boost.daemon.actuator.model

data class ScheduledTasksActuatorResponse(
    val cron: List<Cron>,
    val fixedDelay: List<FixedDelayOrRate>,
    val fixedRate: List<FixedDelayOrRate>,
    val custom: List<Custom>
) {
    data class Cron(
        val runnable: Runnable,
        val expression: String
    )

    data class FixedDelayOrRate(
        val runnable: Runnable,
        val initialDelay: Long,
        val interval: Long
    )

    data class Custom(
        val runnable: Runnable,
        val trigger: String
    )

    data class Runnable(
        val target: String
    )
}