package dev.krud.boost.daemon.configuration.instance.httprequeststatistics.ro

data class InstanceHttpRequestStatisticsRO(
    val uri: String,
    val count: Long,
    val totalTime: Long,
    val max: Long
)
