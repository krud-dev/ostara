package dev.ostara.agent.servicediscovery

import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.service.KubernetesAwarenessService
import io.fabric8.kubernetes.api.model.*
import io.fabric8.kubernetes.client.KubernetesClient
import io.fabric8.kubernetes.client.server.mock.EnableKubernetesMockClient
import io.fabric8.kubernetes.client.server.mock.KubernetesMockServer
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.kotlin.mock
import strikt.api.expect
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo

@EnableKubernetesMockClient(crud = true)
class KubernetesServiceDiscoveryHandlerImplTest {
  private lateinit var client: KubernetesClient
  private lateinit var server: KubernetesMockServer
  private lateinit var kubernetesServiceDiscoveryHandlerImpl: KubernetesServiceDiscoveryHandlerImpl
  private val kubernetesAwarenessService = mock<KubernetesAwarenessService>()

  @BeforeEach
  fun setUp() {
    kubernetesServiceDiscoveryHandlerImpl = KubernetesServiceDiscoveryHandlerImpl(kubernetesAwarenessService, client)
  }

  @Test
  fun `kubernetes happy flow`() {
    val pod = createPod("test-pod-1")
    val service = createService(pod, "test-service")
    val endpoint = createEndpoint(pod, service)
    val config = ServiceDiscoveryProperties.ServiceDiscovery.Kubernetes(
      namespace = "default",
      actuatorPath = "/actuator",
      managementPortName = "management",
      scheme = "http"
    )
    val result = kubernetesServiceDiscoveryHandlerImpl.discoverInstances(config)

    expect {
      that(result).hasSize(1)
      val instance = result.first()
      that(instance.appName).isEqualTo(service.metadata.name)
      that(instance.id).isEqualTo(pod.metadata.uid)
      that(instance.name).isEqualTo(pod.metadata.name)
      that(instance.url).isEqualTo("http://1.2.3.4:8080/actuator")
    }
  }

  private fun createPod(name: String = "test-pod-1", namespace: String = "default"): Pod {
    val pod = PodBuilder()
      .withNewMetadata()
      .withNamespace(namespace)
      .withName(name)
      .withLabels<String, String>(
        mapOf(
          "app.kubernetes.io/name" to name
        )
      )
      .endMetadata()
      .build()
    return client.resource(pod).create()
  }

  private fun createService(pod: Pod, name: String = "test-service-1", namespace: String = "default"): Service {
    val service = ServiceBuilder()
      .withNewMetadata()
      .withNamespace(namespace)
      .withName(name)
      .endMetadata()
      .withNewSpec()
      .withSelector<String, String>(
        mapOf(
          "app.kubernetes.io/name" to pod.metadata.name
        ))
      .withPorts(
        ServicePortBuilder()
          .withName("http")
          .withPort(8080)
          .withTargetPort(IntOrString(8080))
          .build()
      )
      .endSpec()
      .build()
    return client.resource(service).create()
  }

  fun createEndpoint(pod: Pod, service: Service, namespace: String = "default", name: String = service.metadata.name): Endpoints {
    val endpoint = EndpointsBuilder()
      .withNewMetadata()
      .withNamespace(namespace)
      .withName(name)
      .endMetadata()
      .withSubsets(
        EndpointSubsetBuilder()
          .withPorts(
            EndpointPortBuilder()
              .withName("http")
              .withPort(8080)
              .withProtocol("TCP")
              .build()
          )
          .withAddresses(
            EndpointAddressBuilder()
            .withIp("1.2.3.4")
            .withNewTargetRef()
            .withKind("Pod")
            .withName(pod.metadata.name)
            .withUid(pod.metadata.uid)
            .endTargetRef()
            .build()
      )
          .build())
      .build()
    return client.resource(endpoint).create()
  }
}
