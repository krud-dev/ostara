package dev.ostara.agent.servicediscovery

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.ostara.agent.config.ServiceDiscoveryProperties
import org.apache.curator.framework.CuratorFramework
import org.apache.curator.framework.CuratorFrameworkFactory
import org.apache.curator.retry.RetryOneTime
import org.apache.curator.test.TestingServer
import org.intellij.lang.annotations.Language
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.hasSize
import strikt.assertions.isEqualTo

class ZookeeperServiceDiscoveryHandlerImplTest {
  private val server = TestingServer()
  private val handler = ZookeeperServiceDiscoveryHandlerImpl(
    jacksonObjectMapper()
  )
  private lateinit var curatorClient: CuratorFramework
  @Language("json")
  val exampleInstance = """
    {
        "name": "service1",
        "id": "25f48b0e-9421-48c0-8778-7bf7cc2b7795",
        "address": "3334e727b52b",
        "port": 33281,
        "sslPort": null,
        "payload": {
            "@class": "org.springframework.cloud.zookeeper.discovery.ZookeeperInstance",
            "id": "service1",
            "name": "service1",
            "metadata": {
                "instance_status": "UP"
            }
        },
        "registrationTimeUTC": 1688301555673,
        "serviceType": "DYNAMIC",
        "uriSpec": {
            "parts": [
                {
                    "value": "scheme",
                    "variable": true
                },
                {
                    "value": "://",
                    "variable": false
                },
                {
                    "value": "address",
                    "variable": true
                },
                {
                    "value": ":",
                    "variable": false
                },
                {
                    "value": "port",
                    "variable": true
                }
            ]
        }
    }
  """.trimIndent()

  private val config = ServiceDiscoveryProperties.ServiceDiscovery.Zookeeper(
    connectionString = server.connectString,
    actuatorPath = "/management"
  )

  @BeforeEach
  fun setUp() {
    server.start()
    curatorClient = CuratorFrameworkFactory.newClient(
      server.connectString,
      1000,
      1000,
      RetryOneTime(1000)
    )
    curatorClient.start()
  }

  @AfterEach
  fun tearDown() {
    server.close()
    curatorClient.close()
  }

  @Test
  fun `supports should return true on Zookeeper config`() {
    val result = handler.supports(config)
    expect {
      that(result).isEqualTo(true)
    }
  }

  @Test
  fun `zookeeper should return no instances if root node does not exist`() {
    val instances = handler.discoverInstances(config)
    expect {
      that(instances).hasSize(0)
    }
  }

  @Test
  fun `zookeeper service discovery happy flow`() {
    curatorClient.create().forPath("/services")
    curatorClient.create().forPath("/services/service1")
    curatorClient.create()
      .forPath("/services/service1/25f48b0e-9421-48c0-8778-7bf7cc2b7795", exampleInstance.toByteArray())
    val instances = handler.discoverInstances(config)
    expect {
      that(instances).hasSize(1)
      that(instances[0].id).isEqualTo("25f48b0e-9421-48c0-8778-7bf7cc2b7795")
      that(instances[0].name).isEqualTo("3334e727b52b")
      that(instances[0].url).isEqualTo("http://3334e727b52b:33281/management")
    }
  }
}
