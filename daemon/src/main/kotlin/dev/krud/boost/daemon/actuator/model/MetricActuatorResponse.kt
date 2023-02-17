package dev.krud.boost.daemon.actuator.model

data class MetricActuatorResponse(
    val name: String,
    val description: String?,
    val baseUnit: String?,
    val availableTags: List<Tag>,
    val measurements: List<Measurement>
) {
    data class Measurement(
        val statistic: String,
        val value: Double
    )

    data class Tag(
        val tag: String,
        val values: List<String>
    )
}