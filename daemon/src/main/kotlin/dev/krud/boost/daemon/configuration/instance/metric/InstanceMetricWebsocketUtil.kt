package dev.krud.boost.daemon.configuration.instance.metric

import dev.krud.boost.daemon.utils.ParsedMetricName
import java.util.*

object InstanceMetricWebsocketUtil {
    const val METRIC_TOPIC_PREFIX = "/topic/metric"
    val METRIC_TOPIC_TEMPLATE_REGEX = Regex("$METRIC_TOPIC_PREFIX\\/(.*)\\/(.*)")

    fun isValidMetricTopic(topic: String): Boolean {
        return METRIC_TOPIC_TEMPLATE_REGEX.matches(topic)
    }

    fun parseMetricAndInstanceIdFromTopic(topic: String): Pair<UUID, ParsedMetricName> {
        val match = METRIC_TOPIC_TEMPLATE_REGEX.matchEntire(topic) ?: error("Invalid topic: $topic")
        return UUID.fromString(match.groupValues[1]) to ParsedMetricName.from(match.groupValues[2])
    }
}