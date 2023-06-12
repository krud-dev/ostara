package dev.krud.boost.daemon.base.config

import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.nio.file.Path

@Configuration
@ConfigurationProperties(prefix = "app.main", ignoreUnknownFields = true)
class AppMainProperties {
    /**
     * App data directory to use when saving data to disk.
     */
    var heapdumpDirectory: String = "./heapdumps"

    /**
     * App data directory to use when saving backups to disk.
     */
    var backupDirectory: Path = Path.of(".", "backups")
}