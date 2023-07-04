package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnKubernetesEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.service.KubernetesAwarenessService
import io.fabric8.kubernetes.client.KubernetesClient
import io.fabric8.kubernetes.client.KubernetesClientBuilder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import java.nio.file.Files
import java.nio.file.Paths

@Component
@ConditionalOnKubernetesEnabled
class KubernetesServiceDiscoveryHandlerImpl(
  @Autowired(required = false)
  private val kubernetesAwarenessService: KubernetesAwarenessService?
) :
  ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes> {
  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): List<DiscoveredInstanceDTO> {
    val client = getClient(config)
    val namespace = config.namespace
      ?: kubernetesAwarenessService?.getNamespace()
      ?: error("Unable to determine namespace")
    val actuatorPath = config.actuatorPath
    val managementPortName = config.managementPortName
    val scheme = config.scheme
    val podLabels = config.podLabels
    val result = client.use {
      it.endpoints()
        .apply {
          if (namespace == "*") {
            inAnyNamespace()
          } else {
            inNamespace(namespace)
          }
        }
        .list()
        .items
        .flatMap { endpoints ->
          val serviceName = endpoints.metadata.name
          val availablePorts = endpoints.subsets.flatMap { subset ->
            subset.ports
          }
          val port = when {
            !managementPortName.isNullOrBlank() -> availablePorts.firstOrNull { it.name == managementPortName }
              ?: availablePorts.first()
            else -> availablePorts.first()
          }

          endpoints.subsets.flatMap { subset ->
            subset.addresses
              .filter { address ->
                if (kubernetesAwarenessService == null) {
                  true
                } else {
                  address.targetRef?.name != kubernetesAwarenessService.getHostname()
                }
              }
              .filter { address ->
                val targetRef = address.targetRef ?: return@filter false
                if (targetRef.kind != POD_KIND || targetRef.name == null) {
                  return@filter false
                }
                if (podLabels.isEmpty()) {
                  true
                } else {
                  val pod = client
                    .pods()
                    .withName(targetRef.name)
                    .get()
                  podLabels.all { (key, value) ->
                    pod.metadata.labels[key] == value
                  }
                }
              }
              .map { address ->
              DiscoveredInstanceDTO(
                appName = serviceName,
                id = address.targetRef?.uid ?: address.ip,
                name = address.targetRef?.name ?: address.ip,
                url = "$scheme://${address.ip}:${port.port}/${actuatorPath.removePrefix("/")}"
              )
            }
          }
        }
    }
    return result
  }

  private fun getClient(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): KubernetesClient {
    val builder = KubernetesClientBuilder()
    val kubeConfigPath = config.kubeConfigPath
    val kubeConfig = config.kubeConfigYaml
      ?: if (kubeConfigPath != null) {
        Files.readString(Paths.get(kubeConfigPath))
      } else {
        null
      }
    if (kubeConfig != null) {
      builder.withConfig(kubeConfig)
    }
    return builder.build()
  }

  companion object {
    private const val POD_KIND = "Pod"
  }
}
