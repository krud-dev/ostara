package dev.krud.boost.daemon.actuator.model

import dev.krud.boost.daemon.utils.TypeDefaults

data class MetricActuatorResponse(
    val name: String = TypeDefaults.STRING,
    val description: String? = null,
    val baseUnit: String? = null,
    val availableTags: List<Tag> = emptyList(),
    val measurements: List<Measurement> = emptyList()
) {
    data class Measurement(
        val statistic: String = TypeDefaults.STRING,
        val value: Double = TypeDefaults.DOUBLE
    )

    data class Tag(
        val tag: String = TypeDefaults.STRING,
        val values: List<String> = emptyList()
    )
}