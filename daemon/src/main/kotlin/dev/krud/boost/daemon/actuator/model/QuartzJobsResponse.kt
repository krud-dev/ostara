package dev.krud.boost.daemon.actuator.model

data class QuartzJobsResponse(
    val group: String,
    val jobs: Map<String, Job>
) {
    data class Job(
        val className: String
    )
}