package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.krud.boost.daemon.jackson.ToStringDeserializer
import dev.krud.boost.daemon.utils.TypeDefaults

data class EnvActuatorResponse(
    val activeProfiles: Set<String> = emptySet(),
    val propertySources: List<PropertySource> = emptyList()
) {
    data class PropertySource(
        val name: String = TypeDefaults.STRING,
        val properties: Map<String, Property>? = null
    ) {
        data class Property(
            @JsonDeserialize(using = ToStringDeserializer::class)
            val value: String = TypeDefaults.STRING,
            val origin: String? = null
        )
    }
}