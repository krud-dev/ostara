package dev.krud.boost.daemon.actuator.model

import com.google.gson.annotations.SerializedName

data class EndpointsActuatorResponse(
    @SerializedName("_links")
    val links: Map<String, Link>
)  {
    data class Link(
        val href: String,
        val templated: Boolean
    )
}

