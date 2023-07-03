package dev.ostara.springclient

import org.springframework.web.reactive.function.client.WebClient

class OstaraAgentReactiveClient(
  private val url: String,
  private val webClient: WebClient
) : OstaraAgentClient {
  override fun register(request: RegistrationRequest) {
    webClient.post()
      .uri("$url/api/v1/service-discovery/internal/register")
      .bodyValue(request)
      .retrieve()
      .bodyToMono(String::class.java)
      .block()
  }

  override fun deregister(request: RegistrationRequest) {
    webClient.post()
      .uri("$url/api/v1/service-discovery/internal/deregister")
      .bodyValue(request)
      .retrieve()
      .bodyToMono(String::class.java)
      .block()
  }
}
