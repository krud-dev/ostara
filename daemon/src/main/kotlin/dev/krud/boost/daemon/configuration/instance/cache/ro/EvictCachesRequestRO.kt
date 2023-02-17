package dev.krud.boost.daemon.configuration.instance.cache.ro

data class EvictCachesRequestRO(
    val cacheNames: List<String>
)