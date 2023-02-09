package dev.krud.boost.daemon.configuration.application.cache.ro

data class ApplicationCacheStatisticsRO(
    val gets: Long,
    val puts: Long,
    val evictions: Long,
    val hits: Long,
    val misses: Long,
    val removals: Long,
    val size: Long
) {
    companion object {
        val EMPTY = ApplicationCacheStatisticsRO(
            gets = -1,
            puts = -1,
            evictions = -1,
            hits = -1,
            misses = -1,
            removals = -1,
            size = -1
        )
    }
}
