package dev.krud.boost.daemon.configuration.instance.systemproperties.ro

data class InstanceSystemPropertiesRO(
    val properties: Map<String, String>,
    val redactionLevel: RedactionLevel
) {
    enum class RedactionLevel {
        NONE,
        PARTIAL,
        FULL
    }
}