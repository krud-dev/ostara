package dev.krud.boost.daemon.base.config

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling

@Configuration
@EnableScheduling
@ConditionalOnProperty(prefix = AppMainProperties.PREFIX, name = ["scheduling-enabled"], havingValue = "true", matchIfMissing = true)
class SchedulingConfig