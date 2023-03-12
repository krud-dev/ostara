package dev.krud.boost.daemon.actuator.model

data class LiquibaseActuatorResponse(
    val contexts: Map<String, Context>
) {
    data class Context(
        val liquibaseBeans: Map<String, LiquibaseBean>,
        val parentId: String?
    ) {
        data class LiquibaseBean(
            val changeSets: List<ChangeSet>
        ) {
            data class ChangeSet(
                val id: String,
                val checksum: String,
                val orderExecuted: Int,
                val author: String,
                val changeLog: String,
                val comments: String,
                val contexts: List<String>,
                val dateExecuted: String,
                val deploymentId: String,
                val description: String,
                val execType: String,
                val labels: List<String>,
                val tag: String?
            )
        }
    }
}