package dev.krud.boost.daemon.actuator.model

data class FlywayActuatorResponse(
    val contexts: Map<String, Context>
)  {
    data class Context(
        val flywayBeans: Map<String, FlywayBean>
    ) {
        data class FlywayBean(
            val migrations: List<Migration>
        ) {
            data class Migration(
                val type: String,
                val checksum: Long,
                val version: String,
                val description: String,
                val script: String,
                val state: String,
                val installedBy: String,
                val installedOn: String,
                val installedRank: Int,
                val executionTime: Long
            )
        }
    }
}