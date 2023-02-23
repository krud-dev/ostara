package dev.krud.boost.daemon.actuator.model

data class QuartzActuatorResponse(
    val jobs: JobsOrTriggers,
    val triggers: JobsOrTriggers
) {
    data class JobsOrTriggers(
        val groups: List<String>
    )
}