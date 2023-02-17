package dev.krud.boost.daemon.actuator.model

data class InfoActuatorResponse(
    val build: Build?,
    val git: Git?
) {
    data class Build(
        val artifact: String,
        val group: String,
        val name: String,
        val version: String
    )

    data class Git(
        val branch: String,
        val commit: Commit
    ) {
        data class Commit(
            val id: String,
            val time: String
        )
    }
}