package dev.krud.boost.daemon.actuator.model

import java.util.Date

data class InfoActuatorResponse(
    val build: Build?,
    val git: Git?
) {
    data class Build(
        val artifact: String,
        val group: String,
        val name: String,
        val version: String,
        val time: String? // TODO: change to date
    )

    data class Git(
        val branch: String,
        val commit: Commit,
    ) {
        data class Commit(
            val id: String,
            val time: String? // TODO: change to date
        )
    }
}