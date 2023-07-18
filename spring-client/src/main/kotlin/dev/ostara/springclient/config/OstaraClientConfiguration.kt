package dev.ostara.springclient.config

import dev.ostara.springclient.*
import org.springframework.boot.actuate.autoconfigure.endpoint.web.WebEndpointProperties
import org.springframework.boot.actuate.autoconfigure.web.server.ManagementServerProperties
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.boot.autoconfigure.web.ServerProperties
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.client.RestTemplateBuilder
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.function.client.WebClient

@Configuration
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.ANY)
@ConditionalOnClass(
  value = [
    ServerProperties::class,
    ManagementServerProperties::class,
    WebEndpointProperties::class
  ]
)
@EnableConfigurationProperties(
  OstaraClientProperties::class,
  ServerProperties::class,
  ManagementServerProperties::class,
  WebEndpointProperties::class
)
class OstaraClientConfiguration {
  @Configuration
  @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.SERVLET)
  class OstaraWebConfiguration {
    @Bean
    fun ostaraAgentClient(ostaraClientProperties: OstaraClientProperties): OstaraAgentClient {
      val builder = RestTemplateBuilder()
        .apply {
          if (ostaraClientProperties.apiKey.isNotBlank() && ostaraClientProperties.agentUrl.startsWith("https")) {
            this.defaultHeader("X-Ostara-Key", ostaraClientProperties.apiKey)
          }
        }
      return OstaraAgentWebClient(ostaraClientProperties.agentUrl, builder.build())
    }
  }

  @Configuration
  @ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
  class OstaraReactiveConfiguration {
    @Bean
    fun ostaraAgentClient(ostaraClientProperties: OstaraClientProperties): OstaraAgentClient {
      val builder = WebClient.builder()
        .apply {
          if (ostaraClientProperties.apiKey.isNotBlank() && ostaraClientProperties.agentUrl.startsWith("https")) {
            it.defaultHeader("X-Ostara-Key", ostaraClientProperties.apiKey)
          }
        }
      return OstaraAgentReactiveClient(ostaraClientProperties.agentUrl, builder.build())
    }
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
    registrationRequest: RegistrationRequest,
    ostaraClientProperties: OstaraClientProperties
  ): OstaraClientRunner {
    return OstaraClientRunner(ostaraAgentClient, registrationRequest, ostaraClientProperties)
  }
}
