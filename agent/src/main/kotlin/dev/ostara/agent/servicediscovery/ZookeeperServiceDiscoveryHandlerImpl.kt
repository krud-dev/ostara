package dev.ostara.agent.servicediscovery

import com.fasterxml.jackson.databind.ObjectMapper
import dev.ostara.agent.config.ServiceDiscoveryProperties
import dev.ostara.agent.config.condition.ConditionalOnZookeeperEnabled
import dev.ostara.agent.model.DiscoveredInstanceDTO
import io.github.oshai.kotlinlogging.KotlinLogging
import org.apache.curator.framework.CuratorFrameworkFactory
import org.apache.curator.retry.ExponentialBackoffRetry
import org.apache.curator.x.discovery.ServiceInstance
import org.springframework.cloud.zookeeper.discovery.ZookeeperInstance
import org.springframework.stereotype.Component

@Component
@ConditionalOnZookeeperEnabled
class ZookeeperServiceDiscoveryHandlerImpl(
  private val objectMapper: ObjectMapper
) : ServiceDiscoveryHandler<ServiceDiscoveryProperties.ServiceDiscovery.Zookeeper> {
  private val zookeeperPayloadType = objectMapper.typeFactory.constructParametricType(
    ServiceInstance::class.java,
    ZookeeperInstance::class.java
  )

  override fun supports(config: ServiceDiscoveryProperties.ServiceDiscovery): Boolean {
    return config is ServiceDiscoveryProperties.ServiceDiscovery.Zookeeper
  }

  override fun discoverInstances(config: ServiceDiscoveryProperties.ServiceDiscovery.Zookeeper): List<DiscoveredInstanceDTO> {
    val client = CuratorFrameworkFactory.newClient(
      config.connectionString,
      1000,
      1000,
      RETRY_POLICY
    )
    client.start()
    return client.use {
      val node = client.checkExists().forPath(config.rootNode)
      if (node == null) {
        log.warn { "Root node ${config.rootNode} does not exist" }
        return emptyList()
      }
      val services = client.children.forPath(config.rootNode)
      val instances = mutableListOf<DiscoveredInstanceDTO>()
      for (serviceName in services) {
        instances += client.children.forPath("${config.rootNode}/$serviceName")
          .mapNotNull { instanceName ->
            val data = client.data.forPath("${config.rootNode}/$serviceName/$instanceName")
            try {
              objectMapper.readValue(data, zookeeperPayloadType) as ServiceInstance<ZookeeperInstance>
            } catch (e: Exception) {
              log.warn(e) { "Failed to parse instance data for $data" }
              null
            }
          }
          .filter {
            if (config.metadata.isEmpty()) {
              true
            } else {
              config.metadata.all { (key, value) ->
                it.payload.metadata[key] == value }
            }
          }
          .map {
            DiscoveredInstanceDTO(
              appName = serviceName,
              id = it.id,
              name = it.address,
              url = it.url(config.actuatorPath)
            )
          }
      }
      instances
    }
  }

  companion object {
    private val RETRY_POLICY = ExponentialBackoffRetry(1000, 3)
    private val log = KotlinLogging.logger { }

    private fun ServiceInstance<ZookeeperInstance>.scheme(): String {
      return if (this.sslPort != null) {
        "https"
      } else {
        "http"
      }
    }

    private fun ServiceInstance<ZookeeperInstance>.port(): Int {
      return if (this.sslPort != null) {
        this.sslPort
      } else {
        this.port
      }
    }

    private fun ServiceInstance<ZookeeperInstance>.url(actuatorPath: String): String {
      return "${scheme()}://$address:${port()}/${actuatorPath.removePrefix("/")}"
    }
  }
}
