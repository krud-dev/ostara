package dev.krud.boost.daemon.configuration.instance.cache.ro

import dev.krud.boost.daemon.configuration.application.cache.ro.ApplicationCacheStatisticsRO

data class InstanceCacheStatisticsRO(
    val gets: Long,
    val puts: Long,
    val evictions: Long,
    val hits: Long,
    val misses: Long,
    val removals: Long,
    val size: Long
) {
    companion object {
        val EMPTY = InstanceCacheStatisticsRO(
            gets = -1,
            puts = -1,
            evictions = -1,
            hits = -1,
            misses = -1,
            removals = -1,
            size = -1
        )

        fun Collection<InstanceCacheStatisticsRO>.toApplicationRO(): ApplicationCacheStatisticsRO {
            if (isEmpty()) {
                return ApplicationCacheStatisticsRO.EMPTY
            }
            return ApplicationCacheStatisticsRO(
                gets = this.sumOf { it.gets },
                puts = this.sumOf { it.puts },
                evictions = this.sumOf { it.evictions },
                hits = this.sumOf { it.hits },
                misses = this.sumOf { it.misses },
                removals = this.sumOf { it.removals },
                size = this.sumOf { it.size }
            )
        }
    }
}