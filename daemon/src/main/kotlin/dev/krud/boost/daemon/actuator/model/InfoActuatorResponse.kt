package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class InfoActuatorResponse(
    val build: Build? = null,
    val git: Git? = null
) {
    data class Build(
        val artifact: String = TypeDefaults.STRING,
        val group: String = TypeDefaults.STRING,
        val name: String = TypeDefaults.STRING,
        val version: String = TypeDefaults.STRING,
        val time: ParsedDate? = null
    )

    data class Git(
        val branch: String = TypeDefaults.STRING,
        val commit: Commit = Commit()
    ) {
        data class Commit(
            val id: String = TypeDefaults.STRING,
            val time: ParsedDate? = null
        )
    }
}