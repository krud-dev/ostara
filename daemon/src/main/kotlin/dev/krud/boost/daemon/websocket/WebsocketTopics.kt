package dev.krud.boost.daemon.websocket

@JvmInline
value class WebsocketTopic (val value: String)

object WebsocketTopics {
    const val TOPIC_PREFIX = "/topic"

    val AGENT_DISCOVERY_FAILURE = WebsocketTopic("$TOPIC_PREFIX/agentDiscoveryFailure")

    val AGENT_DISCOVERY_START = WebsocketTopic("$TOPIC_PREFIX/agentDiscoveryStart")

    val AGENT_DISCOVERY_SUCCESS = WebsocketTopic("$TOPIC_PREFIX/agentDiscoverySuccess")

    val AGENT_HEALTH = WebsocketTopic("$TOPIC_PREFIX/agentHealth")

    val APPLICATION_CREATION = WebsocketTopic("$TOPIC_PREFIX/applicationCreation")

    val APPLICATION_DELETION = WebsocketTopic("$TOPIC_PREFIX/applicationDeletion")

    val APPLICATION_HEALTH = WebsocketTopic("$TOPIC_PREFIX/applicationHealth")

    val APPLICATION_UPDATE = WebsocketTopic("$TOPIC_PREFIX/applicationUpdate")

    val INSTANCE_HEAPDUMP_DOWNLOAD_PROGRESS = WebsocketTopic("$TOPIC_PREFIX/instanceHeapdumpDownloadProgress")

    val INSTANCE_ABILITY = WebsocketTopic("$TOPIC_PREFIX/instanceAbility")

    val INSTANCE_CREATION = WebsocketTopic("$TOPIC_PREFIX/instanceCreation")

    val INSTANCE_DELETION = WebsocketTopic("$TOPIC_PREFIX/instanceDeletion")

    val INSTANCE_HEALTH = WebsocketTopic("$TOPIC_PREFIX/instanceHealth")

    val INSTANCE_HOSTNAME = WebsocketTopic("$TOPIC_PREFIX/instanceHostname")

    val INSTANCE_UPDATE = WebsocketTopic("$TOPIC_PREFIX/instanceUpdate")

    val INSTANCE_METADATA = WebsocketTopic("$TOPIC_PREFIX/instanceMetadata")

    val APPLICATION_METRIC_RULE_TRIGGERS = WebsocketTopic("$TOPIC_PREFIX/applicationMetricRuleTriggers")

    val INSTANCE_THREAD_PROFILING_PROGRESS = WebsocketTopic("$TOPIC_PREFIX/instanceThreadProfilingProgress")

    val METRIC = WebsocketTopic("$TOPIC_PREFIX/metric")
}