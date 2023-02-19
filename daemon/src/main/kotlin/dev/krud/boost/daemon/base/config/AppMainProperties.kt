package dev.krud.boost.daemon.base.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "app.main", ignoreUnknownFields = true)
class AppMainProperties {
    /**
     * App data directory to use when saving data to disk.
     */
    var heapdumpDirectory: String = "./heapdumps"
}