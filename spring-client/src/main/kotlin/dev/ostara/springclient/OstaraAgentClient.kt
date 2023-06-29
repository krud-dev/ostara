package dev.ostara.springclient

import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.web.client.RestTemplate

class OstaraAgentClient(
  private val url: String,
  private val restTemplate: RestTemplate
) {
  fun register(request: RegistrationRequest) {
    val response = restTemplate.exchange(
      "$url/api/serviceDiscovery/internal/register",
      HttpMethod.POST,
      HttpEntity(request),
      String::class.java
    )
  }

  fun deregister(request: RegistrationRequest) {
    val response = restTemplate.exchange(
      "$url/api/serviceDiscovery/internal/deregister",
      HttpMethod.POST,
      HttpEntity(request),
      String::class.java
    )
  }
}

data class RegistrationRequest(
  val appName: String,
  val host: String,
  val managementUrl: String
)
