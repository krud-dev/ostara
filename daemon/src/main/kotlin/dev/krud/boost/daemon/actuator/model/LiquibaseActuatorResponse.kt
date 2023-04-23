package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.TypeDefaults

data class LiquibaseActuatorResponse(
    val contexts: Map<String, Context> = emptyMap()
) {
    data class Context(
        val liquibaseBeans: Map<String, LiquibaseBean> = emptyMap(),
        val parentId: String? = null
    ) {
        data class LiquibaseBean(
            val changeSets: List<ChangeSet> = emptyList()
        ) {
            data class ChangeSet(
                val id: String = TypeDefaults.STRING,
                val checksum: String = TypeDefaults.STRING,
                val orderExecuted: Int = TypeDefaults.INT,
                val author: String = TypeDefaults.STRING,
                val changeLog: String = TypeDefaults.STRING,
                val comments: String = TypeDefaults.STRING,
                val contexts: List<String> = emptyList(),
                val dateExecuted: ParsedDate = TypeDefaults.PARSED_DATE,
                val deploymentId: String = TypeDefaults.STRING,
                val description: String = TypeDefaults.STRING,
                val execType: String = TypeDefaults.STRING,
                val labels: List<String> = emptyList(),
                val tag: String? = null
            )
        }
    }
}