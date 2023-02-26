package dev.krud.boost.daemon.actuator.model

data class QuartzJobsResponse(
    val groups: Map<String, Group>
) {
    data class Group(
        val jobs: List<String>
    )
}