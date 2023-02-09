package dev.krud.boost.daemon.configuration.application.cache.ro

data class ApplicationCacheRO(
    val name: String,
    val cacheManager: String,
    val target: String,
)