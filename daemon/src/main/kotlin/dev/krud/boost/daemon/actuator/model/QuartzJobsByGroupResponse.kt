package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class QuartzJobsByGroupResponse(
    val group: String = TypeDefaults.STRING,
    val jobs: Map<String, Job> = emptyMap()
) {
    data class Job(
        val className: String = TypeDefaults.STRING
    )
}