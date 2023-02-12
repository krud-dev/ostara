package dev.krud.boost.daemon.base.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.dsl.MessageChannels
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor

@Configuration
class IntegrationConfig {
    @Bean
    fun systemEventsChannel(): PublishSubscribeChannel {
        return MessageChannels.publishSubscribe(systemEventsExecutor()).get()
    }

    @Bean
    fun systemEventsExecutor(): ThreadPoolTaskExecutor {
        val pool = ThreadPoolTaskExecutor()
        pool.corePoolSize = 5
        pool.maxPoolSize = 10
        pool.setWaitForTasksToCompleteOnShutdown(true)
        return pool
    }
}