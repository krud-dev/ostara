package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnKubernetesEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import dev.ostara.agent.service.KubernetesAwarenessService
import io.fabric8.kubernetes.api.model.EndpointAddress
import io.fabric8.kubernetes.api.model.EndpointPort
import io.fabric8.kubernetes.api.model.Endpoints
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
      ?: error("Unable to determine namespace! If not running in Kubernetes, please specify the namespace in [ ostara.agent.service-discovery.kubernetes.namespace ]")
    val actuatorPath = config.actuatorPath
    val managementPortName = config.managementPortName
    val scheme = config.scheme
    val podLabels = config.podLabels
    val result = getEndpoints(namespace)
      .flatMap { endpoints ->
        val serviceName = endpoints.metadata.name
        val port = endpoints.getOptimalPort(managementPortName)
        endpoints.subsets.flatMap { subset ->
          subset.addresses
            .filter { address -> !address.isSelf() && address.isTargetPod() && address.doLabelsMatch(podLabels) }
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

  private fun Endpoints.getOptimalPort(desiredPortName: String?): EndpointPort {
    val availablePorts = subsets.flatMap { subset -> subset.ports }
    val port = when {
      !desiredPortName.isNullOrBlank() -> availablePorts.firstOrNull { it.name == desiredPortName }
        ?: availablePorts.first()

      else -> availablePorts.first()
    }
    return port
  }

  private fun EndpointAddress.isSelf(): Boolean {
    return kubernetesAwarenessService?.let {
        this.targetRef?.name == kubernetesAwarenessService.getHostname()
    } ?: false
  }

  private fun EndpointAddress.isTargetPod(): Boolean {
    return this.targetRef?.kind == POD_KIND
  }

  private fun EndpointAddress.doLabelsMatch(labels: Map<String, String>): Boolean {
    if (labels.isEmpty()) {
      return true
    }
    val pod = client
      .pods()
      .withName(this.targetRef.name)
      .get() ?: return false
    return labels.all { (key, value) ->
      pod.metadata.labels[key] == value
    }
  }

  private fun getEndpoints(namespace: String): List<Endpoints> {
    return client.endpoints()
      .let { operation ->
        if (namespace == "*") {
          operation.inAnyNamespace()
        } else {
          operation.inNamespace(namespace)
        }
      }
      .list()
      .items
  }

  companion object {
    private const val POD_KIND = "Pod"
  }
}
