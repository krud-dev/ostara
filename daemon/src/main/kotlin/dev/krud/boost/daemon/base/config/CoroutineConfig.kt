package dev.krud.boost.daemon.base.config

import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class CoroutineConfig {
    @Bean
    fun defaultDispatcher(): CoroutineDispatcher = Dispatchers.Default
}