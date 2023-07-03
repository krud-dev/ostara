package dev.ostara.agent.util

const val API_PREFIX = "/api/v1"
const val AGENT_KEY_HEADER = "X-Ostara-Key"
const val CONFIGURATION_PREFIX = "ostara.agent"

const val PROXY_INSTANCE_ID_HEADER = "X-Ostara-InstanceId"
val PROXY_HEADERS_TO_REMOVE = listOf(PROXY_INSTANCE_ID_HEADER, "Host", "User-Agent", "Connection")
