package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnKubernetesEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import io.kubernetes.client.openapi.apis.CoreV1Api
import io.kubernetes.client.util.Config
import org.springframework.stereotype.Component
import java.io.StringReader

@Component
@ConditionalOnKubernetesEnabled
class KubernetesServiceDiscoveryHandlerImpl :
  ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes> {
  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): List<DiscoveredInstanceDTO> {
    val api = getClient(config)
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

  private fun getClient(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): CoreV1Api {
    val kubeConfigPath = config.kubeConfigPath
    val kubeConfigYaml = config.kubeConfigYaml
    val client = if (kubeConfigYaml != null) {
      Config.fromConfig(
        StringReader(kubeConfigYaml)
      )
    } else if (kubeConfigPath != null) {
      Config.fromConfig(kubeConfigPath)
    } else {
      Config.defaultClient()
    }
    return CoreV1Api(client)
  }
}
