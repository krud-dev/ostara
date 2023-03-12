package dev.krud.boost.daemon.configuration.instance.systemenvironment.ro

data class InstanceSystemEnvironmentRO(
    val properties: Map<String, String>,
    val redactionLevel: RedactionLevel
) {
    enum class RedactionLevel {
        NONE,
        PARTIAL,
        FULL
    }
}