package dev.krud.boost.daemon.base.config

import io.sentry.Sentry
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class SentryConfig {

    @Bean
    fun applySentryTags() = CommandLineRunner {
        Sentry.setTag("boost.type", "daemon")
    }
}