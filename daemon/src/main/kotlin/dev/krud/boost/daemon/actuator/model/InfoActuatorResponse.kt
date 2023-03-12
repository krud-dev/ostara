package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate

data class InfoActuatorResponse(
    val build: Build?,
    val git: Git?
) {
    data class Build(
        val artifact: String,
        val group: String,
        val name: String,
        val version: String,
        val time: ParsedDate?
    )

    data class Git(
        val branch: String,
        val commit: Commit
    ) {
        data class Commit(
            val id: String,
            val time: ParsedDate?
        )
    }
}