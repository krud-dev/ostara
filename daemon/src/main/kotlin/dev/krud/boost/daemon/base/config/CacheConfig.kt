package dev.krud.boost.daemon.base.config

import com.github.benmanes.caffeine.cache.Cache
import com.github.benmanes.caffeine.cache.Caffeine
import dev.krud.boost.daemon.configuration.instance.httprequeststatistics.ro.InstanceHttpRequestStatisticsRO
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.time.Duration
import java.util.*

@Configuration
class CacheConfig {
    @Bean
    fun httpRequestStatisticsCache(): Cache<String, List<InstanceHttpRequestStatisticsRO>> {
        return Caffeine.newBuilder()
            .expireAfterWrite(Duration.ofMinutes(10))
            .build()
    }
}