package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.annotation.JsonProperty
import dev.krud.boost.daemon.utils.TypeDefaults

data class EndpointsActuatorResponse(
    @JsonProperty("_links")
    val links: Map<String, Link> = emptyMap()
) {
    data class Link(
        val href: String = TypeDefaults.STRING,
        val templated: Boolean = TypeDefaults.BOOLEAN
    )
}