package dev.ostara.agent.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.client.RestTemplate

@Configuration
class WebConfig {
  @Bean
  fun restTemplate(): RestTemplate {
    return RestTemplate()
  }
}
