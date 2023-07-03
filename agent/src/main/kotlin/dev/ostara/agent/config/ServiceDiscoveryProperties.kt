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

  @NestedConfigurationProperty
  var zookeeper: List<ServiceDiscovery.Zookeeper> = emptyList()

  sealed interface ServiceDiscovery {
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

    data class Zookeeper(
      /**
       * The Zookeeper connection string
       */
      val connectionString: String,
      /**
       * The Zookeeper path to the service discovery root
       */
      val rootNode: String = "/services",
      val metadata: Map<String, String> = emptyMap(),
      /**
       * The path to the actuator endpoint
       */
      val actuatorPath: String = "/actuator",
    ) : ServiceDiscovery
  }

  companion object {
    val ServiceDiscoveryProperties.serviceDiscoveries get() = kubernetes + zookeeper
  }
}
