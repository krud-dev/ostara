package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class FlywayActuatorResponse(
    val contexts: Map<String, Context> = emptyMap()
) {
    data class Context(
        val flywayBeans: Map<String, FlywayBean> = emptyMap(),
        val parentId: String? = null
    ) {
        data class FlywayBean(
            val migrations: List<Migration> = emptyList()
        ) {
            data class Migration(
                val type: String = TypeDefaults.STRING,
                val checksum: Long = TypeDefaults.LONG,
                val version: String? = null,
                val description: String = TypeDefaults.STRING,
                val script: String = TypeDefaults.STRING,
                val state: String = TypeDefaults.STRING,
                val installedBy: String = TypeDefaults.STRING,
                val installedOn: ParsedDate = TypeDefaults.PARSED_DATE,
                val installedRank: Int = TypeDefaults.INT,
                val executionTime: Long = TypeDefaults.LONG
            )
        }
    }
}