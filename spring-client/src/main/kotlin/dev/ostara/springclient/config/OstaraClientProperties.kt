package dev.ostara.springclient.config

import dev.ostara.springclient.util.CONFIGURATION_PREFIX
import org.hibernate.validator.constraints.URL
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@Validated
@ConfigurationProperties(prefix = CONFIGURATION_PREFIX)
class OstaraClientProperties {
  /**
   * The URL of the Ostara Agent.
   */
  @field:URL
  var agentUrl: String = ""

  /**
   * The API key to use when communicating with the Ostara Agent.
   */
  var apiKey: String = ""

  /**
   * The name of the application to register with the Ostara Agent, if not set the value of `spring.application.name` will be used.
   */
  var applicationName: String = ""

  /**
   * The interval in seconds for the [OstaraClientRunner] to run and register the application with the Ostara Agent.
   */
  var runnerIntervalSeconds = 10L
}
