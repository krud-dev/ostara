package dev.ostara.agent.servicediscovery.handler

import dev.ostara.agent.configuration.OstaraConfiguration
import dev.ostara.agent.servicediscovery.DiscoveredInstanceDTO
import io.kubernetes.client.openapi.apis.CoreV1Api
import io.kubernetes.client.util.Config


class KubernetesServiceDiscoveryHandlerImpl : ServiceDiscoveryHandler<OstaraConfiguration.ServiceDiscovery.Kubernetes> {
  private val client = Config.defaultClient()
  private val api = CoreV1Api()
    .apply { apiClient = client }

  override fun supports(config: OstaraConfiguration.ServiceDiscovery): Boolean {
    return config is OstaraConfiguration.ServiceDiscovery.Kubernetes
  }

  override fun discoverInstances(config: OstaraConfiguration.ServiceDiscovery.Kubernetes): List<DiscoveredInstanceDTO> {
    val namespace = config.namespace
    val appNameLabel = config.appNameLabel
    val actuatorPath = config.actuatorPath
    val port = config.port
    val scheme = config.scheme
    val pods = api.listNamespacedPod(namespace, null, null, null, null, null, null, null, null, 10, false)
    val result = pods.items
      .groupBy { it.metadata?.labels?.get(appNameLabel) }
      .mapValues { (appName, pods) ->
        pods.map { pod ->
          DiscoveredInstanceDTO(
            appName = appName,
            id = pod.metadata!!.uid!!,
            name = pod.metadata!!.name!!,
            url = "$scheme://${pod.status!!.podIP}:$port/${actuatorPath.removePrefix("/")}"
          )
        }
      }.flatMap { it.value }
    return result
  }
}
