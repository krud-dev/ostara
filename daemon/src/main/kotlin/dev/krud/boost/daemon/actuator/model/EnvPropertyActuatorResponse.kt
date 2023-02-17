package dev.krud.boost.daemon.actuator.model

data class EnvPropertyActuatorResponse(
    val property: Property,
    val activeProfiles: Set<String>,
    val propertySources: List<PropertySource>
) {
    data class Property(
        val value: String,
        val source: String
    )

    data class PropertySource(
        val name: String,
        val properties: Map<String, Property>?
    ) {
        data class Property(
            val value: String,
            val origin: String?
        )
    }
}