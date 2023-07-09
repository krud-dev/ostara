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
       * The namespace to search for pods in. Does not need to be set if running in a pod, otherwise mandatory
       */
      val namespace: String? = null,
      /**
       * The path to the actuator endpoint
       */
      val actuatorPath: String = "/actuator",
      /**
       * The name of the port as specified in the service which exposes the actuator endpoint, when multiple ports exists
       */
      val managementPortName: String? = "management",
      /**
       * The scheme to use when connecting to the actuator endpoint
       */
      val scheme: String = "http",
      /**
       * Pod labels to match against
       */
      val podLabels: Map<String, String> = emptyMap(),
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
      /**
       * Metadata to match against
       */
      val metadata: Map<String, String> = emptyMap(),
      /**
       * The path to the actuator endpoint
       */
      val actuatorPath: String = "/actuator",
    ) : ServiceDiscovery
  }

  companion object {
    const val PREFIX = "$CONFIGURATION_PREFIX.service-discovery"
    val ServiceDiscoveryProperties.serviceDiscoveries get() = listOfNotNull(internal, kubernetes, zookeeper)
    val ServiceDiscoveryProperties.serviceDiscoveriesWithoutInternal get()
    = serviceDiscoveries.filter { it !is ServiceDiscovery.Internal }
  }
}
