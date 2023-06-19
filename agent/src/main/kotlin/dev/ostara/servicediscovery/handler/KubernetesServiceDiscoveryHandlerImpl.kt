package dev.ostara.servicediscovery.handler

import dev.ostara.param.dsl.params
import dev.ostara.param.model.ParamSchema
import dev.ostara.param.model.Params
import dev.ostara.servicediscovery.DiscoveredInstanceDTO
import io.kubernetes.client.openapi.apis.CoreV1Api
import io.kubernetes.client.util.Config


class KubernetesServiceDiscoveryHandlerImpl : ServiceDiscoveryHandler {
  override val type: String = "kubernetes"
  override val params: List<ParamSchema> = params {
    stringParam("namespace") {
      required = true
      description = "The namespace to search for pods in"
    }
    stringParam("labelSelector") {
      required = true
      description = "The label selector to use when searching for pods"
    }
    stringParam("actuatorPath") {
      required = true
      description = "The path to the actuator endpoint"
      defaultValue = "/actuator"
    }
    intParam("port") {
      required = true
      description = "The port to use when connecting to the actuator endpoint"
      defaultValue = 8080
    }
    stringParam("scheme") {
      required = true
      description = "The scheme to use when connecting to the actuator endpoint"
      defaultValue = "http"
      validOptions = listOf("http", "https")
    }
  }

  val client = Config.defaultClient()
  val api = CoreV1Api()
    .apply { apiClient = client }

  override fun discoverInstances(config: Params): List<DiscoveredInstanceDTO> {
    val namespace by config.resolveRequired<String>()
    val labelSelector by config.resolveRequired<String>()
    val actuatorPath by config.resolveRequired<String>()
    val port by config.resolveRequired<Int>()
    val scheme by config.resolveRequired<String>()
    val pods = api.listNamespacedPod(namespace, null, null, null, null, labelSelector, null, null, null, 10, false)
    return pods.items.map { pod ->
      DiscoveredInstanceDTO(
        id = pod.metadata!!.uid!!,
        name = pod.metadata!!.name!!,
        url = "$scheme://${pod.status!!.podIP}:$port/${actuatorPath.removePrefix("/")}"
      )
    }
  }
}

