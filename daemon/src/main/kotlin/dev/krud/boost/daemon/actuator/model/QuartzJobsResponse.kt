package dev.krud.boost.daemon.actuator.model

data class QuartzJobsResponse(
    val groups: Map<String, Group> = emptyMap()
) {
    data class Group(
        val jobs: List<String> = emptyList()
    )
}