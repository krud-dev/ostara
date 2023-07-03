package dev.ostara.agent.config

import dev.ostara.agent.util.CONFIGURATION_PREFIX
import org.springframework.boot.context.properties.ConfigurationProperties
import org.springframework.boot.context.properties.NestedConfigurationProperty
import org.springframework.context.annotation.Configuration

@Configuration
@ConfigurationProperties(prefix = ServiceDiscoveryProperties.PREFIX, ignoreUnknownFields = false)
class ServiceDiscoveryProperties {
  /**
   * Internal service discovery configuration
   */
  var internal: ServiceDiscovery.Internal = ServiceDiscovery.Internal()
  /**
   * Kubernetes service discovery configuration
   */
  @NestedConfigurationProperty
  var kubernetes: ServiceDiscovery.Kubernetes? = null

  /**
   * Zookeeper service discovery configuration
   */
  @NestedConfigurationProperty
  var zookeeper: ServiceDiscovery.Zookeeper? = null

  sealed interface ServiceDiscovery {
    val enabled: Boolean
    data class Internal(
      override val enabled: Boolean = true,
    ) : ServiceDiscovery
    data class Kubernetes(
      override val enabled: Boolean = false,
      /**
       * The path to the kubeconfig file
       */
      val kubeConfigPath: String? = null,
      /**
       * The kubeconfig yaml as a string, supersedes [kubeConfigPath] if set
       */
      val kubeConfigYaml: String? = null,
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
      override val enabled: Boolean = false,
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
    const val PREFIX = "$CONFIGURATION_PREFIX.service-discovery"
    val ServiceDiscoveryProperties.serviceDiscoveries get()
    = listOfNotNull(internal, kubernetes, zookeeper)
        .filter { it.enabled }
  }
}
