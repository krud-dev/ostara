package dev.ostara.springclient.config

import dev.ostara.springclient.util.CONFIGURATION_PREFIX
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = CONFIGURATION_PREFIX)
class OstaraClientProperties {
  var agentUrl: String = ""
  var apiKey: String = ""
  var applicationName: String = ""
}
