package dev.ostara.springclient

import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.web.client.RestTemplate

class OstaraAgentWebClient(
  private val url: String,
  private val restTemplate: RestTemplate
) : OstaraAgentClient {
  override fun register(request: RegistrationRequest) {
    val response = restTemplate.exchange(
      "$url/api/v1/service-discovery/internal/register",
        HttpMethod.POST,
        HttpEntity(request),
      String::class.java
    )
  }

  override fun deregister(request: RegistrationRequest) {
    val response = restTemplate.exchange(
      "$url/api/v1/service-discovery/internal/deregister",
        HttpMethod.POST,
        HttpEntity(request),
      String::class.java
    )
  }
}
