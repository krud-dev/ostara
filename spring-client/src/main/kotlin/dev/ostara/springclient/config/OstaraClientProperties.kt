package dev.ostara.springclient.config

import dev.ostara.springclient.util.CONFIGURATION_PREFIX
import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.URL
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.validation.annotation.Validated

@Validated
@ConfigurationProperties(prefix = CONFIGURATION_PREFIX)
class OstaraClientProperties {
  @field:NotBlank
  @field:URL
  var agentUrl: String = ""
  var apiKey: String = ""
  var applicationName: String = ""
}
