package dev.ostara.agent.controller

import dev.ostara.agent.service.ServiceDiscoveryService
import dev.ostara.agent.util.API_PREFIX
import dev.ostara.agent.util.PROXY_INSTANCE_ID_HEADER
import dev.ostara.agent.util.ensureSuffix
import org.springframework.http.RequestEntity
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.client.RestTemplate

@RestController
@RequestMapping(ProxyController.PATH)
class ProxyController(
  private val restTemplate: RestTemplate,
  private val serviceDiscoveryService: ServiceDiscoveryService
) {
  @RequestMapping("/**")
  fun doCall(
    @RequestHeader(PROXY_INSTANCE_ID_HEADER) instanceId: String,
    requestEntity: RequestEntity<Any>
  ): ResponseEntity<String> {
    val instance = serviceDiscoveryService.getDiscoveredInstanceById(instanceId)
      ?: return ResponseEntity.notFound().build()
    val instanceUrl = instance.url!!
    val url = (instanceUrl.ensureSuffix("/") + requestEntity.url.path.replace(PATH, "").removePrefix("/"))
      .removeSuffix("/")
    return restTemplate.exchange(url, requestEntity.method!!, requestEntity, String::class.java)
  }

  companion object {
    const val PATH = "$API_PREFIX/proxy"
  }
}
