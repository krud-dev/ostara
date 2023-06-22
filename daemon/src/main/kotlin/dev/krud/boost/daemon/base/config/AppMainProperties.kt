package dev.krud.boost.daemon.base.config

import org.springframework.beans.factory.InitializingBean
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.nio.file.Path
import kotlin.io.path.createDirectories

@Configuration
@ConfigurationProperties(prefix = "app.main", ignoreUnknownFields = true)
class AppMainProperties : InitializingBean  {
    /**
     * App data directory to use when saving data to disk.
     */
    var heapdumpDirectory: String = "./heapdumps"

    /**
     * App data directory to use when saving backups to disk.
     */
    var backupDirectory: Path = Path.of(".", "backups")

    override fun afterPropertiesSet() {
        Path.of(heapdumpDirectory).createDirectories()
        backupDirectory.createDirectories()
    }
}