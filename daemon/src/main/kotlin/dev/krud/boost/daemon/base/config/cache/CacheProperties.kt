package dev.krud.boost.daemon.base.config.cache

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.time.Duration

@Configuration
@ConfigurationProperties(prefix = "cache", ignoreUnknownFields = true)
class CacheProperties {
    var caches: List<CacheDTO> = listOf()

    companion object {
        data class CacheDTO(
            val name: String,
            val expireAfterWrite: Duration?,
            val expireAfterAccess: Duration?,
            val maximumSize: Long?
        )
    }
}