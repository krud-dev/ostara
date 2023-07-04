package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnKubernetesEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.service.KubernetesAwarenessService
import io.fabric8.kubernetes.client.KubernetesClient
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
@ConditionalOnKubernetesEnabled
class KubernetesServiceDiscoveryHandlerImpl(
  @Autowired(required = false)
  private val kubernetesAwarenessService: KubernetesAwarenessService?,
  private val client: KubernetesClient
) :
  ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes> {
  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes): List<DiscoveredInstanceDTO> {
    val namespace = config.namespace
      ?: kubernetesAwarenessService?.getNamespace()
      ?: error("Unable to determine namespace")
    val actuatorPath = config.actuatorPath
    val managementPortName = config.managementPortName
    val scheme = config.scheme
    val podLabels = config.podLabels
    val result = client.endpoints()
      .let { operation ->
        if (namespace == "*") {
          operation.inAnyNamespace()
        } else {
          operation.inNamespace(namespace)
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
    return result
  }

  companion object {
    private const val POD_KIND = "Pod"
  }
}
