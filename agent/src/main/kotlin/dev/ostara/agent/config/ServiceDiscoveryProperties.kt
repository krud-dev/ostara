package dev.ostara.agent.config

import dev.ostara.agent.util.CONFIGURATION_PREFIX
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.NestedConfigurationProperty
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = "$CONFIGURATION_PREFIX.service-discovery", ignoreUnknownFields = false)
class ServiceDiscoveryProperties {
  /**
   * List of Kubernetes service discovery strategies to use
   */
  @NestedConfigurationProperty
  var kubernetes: List<ServiceDiscovery.Kubernetes> = emptyList()

  sealed interface ServiceDiscovery {
    data class Internal(
      /**
       * The API key to be used when registering the instance against this agent
       */
      val apiKey: String
    ) : ServiceDiscovery

    data class Kubernetes(
      /**
       * The namespace to search for pods in
       */
      val namespace: String,
      /**
       * The label selector to use when searching for pods
       */
      val appNameLabel: String,
      /**
       * The path to the actuator endpoint
       */
      val actuatorPath: String = "/actuator",
      /**
       * The port to use when connecting to the actuator endpoint
       */
      val port: Int = 8080,
      /**
       * The scheme to use when connecting to the actuator endpoint
       */
      val scheme: String = "http",
    ) : ServiceDiscovery
  }

  companion object {
    val ServiceDiscoveryProperties.serviceDiscoveries get() = kubernetes
  }
}
