package dev.krud.boost.daemon.actuator.model

import com.fasterxml.jackson.annotation.JsonProperty

data class EndpointsActuatorResponse(
    @JsonProperty("_links")
    val links: Map<String, Link>
) {
    data class Link(
        val href: String,
        val templated: Boolean
    )
}