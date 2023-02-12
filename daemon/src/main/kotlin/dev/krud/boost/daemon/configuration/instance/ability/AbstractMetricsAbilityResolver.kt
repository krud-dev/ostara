package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility

/**
 * An [InstanceAbilityResolver] that resolves an ability based on the presence of a metric.
 */
sealed class AbstractMetricsAbilityResolver(
    override val ability: InstanceAbility,
    private val metricNames: Set<String>,
    private val mode: Mode
) : InstanceAbilityResolver {
    override fun hasAbility(options: InstanceAbilityResolver.Options): Boolean {
        if (!options.endpoints.contains("metrics")) {
            return false
        }
        val actuatorClient = options.actuatorClient

        val (metricNames) = actuatorClient.metrics()
        return when (mode) {
            Mode.ALL -> metricNames.containsAll(this.metricNames)
            Mode.ANY -> metricNames.any { this.metricNames.contains(it) }
        }
    }

    enum class Mode {
        ALL, ANY
    }
}