package dev.krud.boost.daemon.actuator.model

data class QuartzJobsByGroupResponse(
    val group: String,
    val jobs: Map<String, Job>
) {
    data class Job(
        val className: String
    )
}