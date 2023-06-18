package dev.krud.boost.daemon.base.config

import io.sentry.Sentry
import org.springframework.boot.CommandLineRunner
import org.springframework.boot.info.BuildProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SentryConfig {
    @Bean
    fun applySentryTags(buildProperties: BuildProperties) = CommandLineRunner {
        Sentry.setTag("service.type", "daemon")
        Sentry.setTag("daemon.version", buildProperties.version)
    }
}