package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class IntegrationGraphActuatorResponse(
    val contentDescriptor: ContentDescriptor = ContentDescriptor(),
    val nodes: List<Node> = emptyList(),
    val links: List<Link> = emptyList()
) {
    data class ContentDescriptor(
        val providerVersion: String = TypeDefaults.STRING,
        val providerFormatVersion: Double = TypeDefaults.DOUBLE,
        val provider: String = TypeDefaults.STRING,
        val name: String? = null
    )

    data class Node(
        val nodeId: Int = TypeDefaults.INT,
        val componentType: String = TypeDefaults.STRING,
        val integrationPatternType: String = TypeDefaults.STRING,
        val integrationPatternCategory: String = TypeDefaults.STRING,
        val properties: Map<String, String> = emptyMap(),
        val sendTimers: Map<String, SendTimer>? = null,
        val receiveCounters: Map<String, Int>? = null,
        val name: String = "",
        val input: String? = null,
        val output: String? = null,
        val errors: String? = null, // Not sure what type this is
        val discards: String? = null, // Not sure what type this is
        val routes: Set<String>? = null // Another ambiguous type, need to verify
    ) {
        data class SendTimer(
            val count: Int = TypeDefaults.INT,
            val mean: Double = TypeDefaults.DOUBLE,
            val max: Double = TypeDefaults.DOUBLE,
        )
    }

    data class Link(
        val from: Int,
        val to: Int,
        val type: String
    )
}