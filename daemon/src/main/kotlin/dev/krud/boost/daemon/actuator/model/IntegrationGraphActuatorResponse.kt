package dev.krud.boost.daemon.actuator.model

import com.google.gson.annotations.SerializedName

data class IntegrationGraphActuatorResponse(
    val contentDescriptor: ContentDescriptor,
    val nodes: List<Node>,
    val links: List<Link>
) {
    data class ContentDescriptor(
        val providerVersion: String,
        val providerFormatVersion: Double,
        val provider: String,
        val name: String
    )

    data class Node(
        val nodeId: Int,
        val componentType: String,
        val integrationPatternType: String,
        val integrationPatternCategory: String,
        val properties: Map<String, String>,
        val sendTimers: Map<String, SendTimer>,
        val receiveCounters: Map<String, Int>,
        val name: String
    ) {
        data class SendTimer(
            val count: Int,
            val mean: Double,
            val max: Double
        )
    }

    data class Link(
        val from: Int,
        val to: Int,
        val type: Type
    ) {
        enum class Type {
            @SerializedName("input")
            INPUT,

            @SerializedName("output")
            OUTPUT
        }
    }
}