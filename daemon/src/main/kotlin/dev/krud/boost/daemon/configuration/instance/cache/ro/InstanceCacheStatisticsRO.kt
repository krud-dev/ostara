package dev.krud.boost.daemon.configuration.instance.cache.ro

data class InstanceCacheStatisticsRO(
    val gets: Long,
    val puts: Long,
    val evictions: Long,
    val hits: Long,
    val misses: Long,
    val removals: Long,
    val size: Long
)
