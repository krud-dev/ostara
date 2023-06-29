package dev.ostara.springclient.config

import dev.ostara.springclient.OstaraAgentClient
import dev.ostara.springclient.OstaraClientRunner
import dev.ostara.springclient.RegistrationRequest
import dev.ostara.springclient.RegistrationRequestFactory
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementServerProperties
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET) // TODO: handle reactive
@EnableConfigurationProperties(OstaraClientProperties::class)
class OstaraClientAutoConfiguration {
  @Bean
  fun ostaraAgentClient(ostaraClientProperties: OstaraClientProperties): OstaraAgentClient {
    val builder = RestTemplateBuilder()
      .apply {
        if (ostaraClientProperties.apiKey.isNotBlank() && ostaraClientProperties.agentUrl.startsWith("https")) {
          this.defaultHeader("X-Ostara-Key", ostaraClientProperties.apiKey)
        }
      }
    return OstaraAgentClient(ostaraClientProperties.agentUrl, builder.build())
  }

  @Bean
  fun registrationRequestFactory(
    applicationContext: ApplicationContext,
    ostaraClientProperties: OstaraClientProperties,
    serverProperties: ServerProperties,
    managementServerProperties: ManagementServerProperties,
    webEndpointProperties: WebEndpointProperties
  ): RegistrationRequestFactory {
    return RegistrationRequestFactory(
      applicationContext,
      ostaraClientProperties,
      serverProperties,
      managementServerProperties,
      webEndpointProperties
    )
  }

  @Bean
  fun ostaraClientRunner(
    ostaraAgentClient: OstaraAgentClient,
    registrationRequest: RegistrationRequest
  ): OstaraClientRunner {
    return OstaraClientRunner(ostaraAgentClient, registrationRequest)
  }
}
