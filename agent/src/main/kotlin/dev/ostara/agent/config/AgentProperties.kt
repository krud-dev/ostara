package dev.ostara.agent.config

import dev.ostara.agent.util.CONFIGURATION_PREFIX
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.beans.factory.InitializingBean
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.context.annotation.Configuration
import java.util.*

@ConfigurationProperties(prefix = "$CONFIGURATION_PREFIX.main", ignoreUnknownFields = false)
@Configuration
class AgentProperties : InitializingBean {
  /**
   * The API key used to authenticate with the Ostara agent over SSL.
   */
  var apiKey: String = ""

  override fun afterPropertiesSet() {
    if (apiKey.isBlank()) {
      apiKey = UUID.randomUUID().toString()
      log.info("Agent API key not found in environment [ ostara.agent.api-key ], a temporary key will be generated...")
      log.info("Temporary Agent API key: $apiKey")
    }
  }

  companion object {
    private val log = KotlinLogging.logger { }
  }
}
