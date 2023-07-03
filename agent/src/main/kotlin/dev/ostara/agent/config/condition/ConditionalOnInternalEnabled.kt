package dev.ostara.agent.config.condition

import dev.ostara.agent.config.ServiceDiscoveryProperties
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty

@Target(AnnotationTarget.CLASS)
@ConditionalOnProperty(prefix = ServiceDiscoveryProperties.PREFIX, name = ["internal.enabled"], havingValue = "true", matchIfMissing = true)
annotation class ConditionalOnInternalEnabled
