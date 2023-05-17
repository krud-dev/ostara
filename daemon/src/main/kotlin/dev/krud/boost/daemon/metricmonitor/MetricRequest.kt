package dev.krud.boost.daemon.metricmonitor

import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.concurrent.atomic.AtomicInteger

class MetricRequest(
    val metricName: ParsedMetricName,
    val tags: Map<String, String> = emptyMap(),
    val requesterCount: AtomicInteger = AtomicInteger(0)
) {
    fun inc() = requesterCount.incrementAndGet()
    fun dec() = requesterCount.decrementAndGet()

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as MetricRequest

        if (metricName != other.metricName) return false
        if (tags != other.tags) return false

        return true
    }

    override fun hashCode(): Int {
        var result = metricName.hashCode()
        result = 31 * result + tags.hashCode()
        return result
    }
}