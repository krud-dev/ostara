package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.model.DiscoveredInstanceDTO
import io.kubernetes.client.openapi.apis.CoreV1Api
import io.kubernetes.client.util.Config
import org.springframework.stereotype.Component

@Component
class KubernetesServiceDiscoveryHandlerImpl :
  ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes> {
  private val client = Config.defaultClient()
  private val api = CoreV1Api()
    .apply { apiClient = client }

  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): List<DiscoveredInstanceDTO> {
    val namespace = config.namespace
    val appNameLabel = config.appNameLabel
    val actuatorPath = config.actuatorPath
    val port = config.port
    val scheme = config.scheme
    val pods = api.listNamespacedPod(namespace, null, null, null, null, null, null, null, null, 10, false)
    val result = pods.items
      .groupBy { it.metadata?.labels?.get(appNameLabel) }
      .filterKeys { it != null }
      .mapValues { (appName, pods) ->
        pods.map { pod ->
          DiscoveredInstanceDTO(
            appName = appName!!,
            id = pod.metadata!!.uid!!,
            name = pod.metadata!!.name!!,
            url = "$scheme://${pod.status!!.podIP}:$port/${actuatorPath.removePrefix("/")}"
          )
        }
      }.flatMap { it.value }
    return result
  }
}
