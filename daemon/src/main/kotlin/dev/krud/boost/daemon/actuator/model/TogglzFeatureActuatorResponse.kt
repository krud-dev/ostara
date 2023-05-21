package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class TogglzFeatureActuatorResponse(
    val name: String = TypeDefaults.STRING,
    val enabled: Boolean = TypeDefaults.BOOLEAN,
    val strategy: String? = null,
    val params: Map<String, String?>? = null,
    val metadata: Metadata? = null
) {
    data class Metadata(
        val label: String = TypeDefaults.STRING,
        val groups: Set<String> = emptySet(),
        val enabledByDefault: Boolean = TypeDefaults.BOOLEAN,
        val attributes: Map<String, String?>? = null
    )
}

