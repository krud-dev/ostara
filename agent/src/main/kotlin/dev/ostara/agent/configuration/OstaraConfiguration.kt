package dev.ostara.agent.configuration

import com.sksamuel.hoplite.ConfigLoaderBuilder
import com.sksamuel.hoplite.addFileSource
import com.sksamuel.hoplite.fp.getOrElse

data class OstaraConfiguration(
  /**
   * List of service discovery strategies to use
   */
  var serviceDiscoveries: List<ServiceDiscovery>
) {
  sealed interface ServiceDiscovery {
    val type: String
    data class Internal(
      /**
       * The API key to be used when registering the instance against this agent
       */
      val apiKey: String,
      override val type: String = "internal"
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
      override val type: String = "kubernetes"
    ) : ServiceDiscovery
  }

  companion object {
    const val DEFAULT_CONFIG_PATH = "/etc/ostara/config.yml"
    fun load(path: String = DEFAULT_CONFIG_PATH): OstaraConfiguration {
      return ConfigLoaderBuilder.default()
        .addFileSource(path, optional = true)
        .strict()
        .build()
        .loadConfig<OstaraConfiguration>()
        .getOrElse {
          throw RuntimeException("Failed to load config: ${it.description()}")
        }
    }
  }
}
