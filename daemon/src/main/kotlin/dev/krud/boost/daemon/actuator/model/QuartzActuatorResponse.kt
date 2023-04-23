package dev.krud.boost.daemon.actuator.model

data class QuartzActuatorResponse(
    val jobs: JobsOrTriggers = JobsOrTriggers(),
    val triggers: JobsOrTriggers = JobsOrTriggers()
) {
    data class JobsOrTriggers(
        val groups: List<String> = emptyList()
    )
}