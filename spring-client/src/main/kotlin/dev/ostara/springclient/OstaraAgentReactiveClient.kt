package dev.ostara.springclient

import dev.ostara.springclient.util.DEREGISTRATION_ENDPOINT
import dev.ostara.springclient.util.REGISTRATION_ENDPOINT
import org.springframework.web.reactive.function.client.WebClient

class OstaraAgentReactiveClient(
  private val baseUrl: String,
  private val webClient: WebClient
) : OstaraAgentClient {
  private val registrationUrl = "${baseUrl.removeSuffix("/")}${REGISTRATION_ENDPOINT}"
  private val deregistrationUrl = "${baseUrl.removeSuffix("/")}${DEREGISTRATION_ENDPOINT}}"

  override fun register(request: RegistrationRequest) {

    webClient.post()
      .uri(registrationUrl)
      .bodyValue(request)
      .retrieve()
      .bodyToMono(String::class.java)
      .block()
  }

  override fun deregister(request: RegistrationRequest) {
    webClient.post()
      .uri(deregistrationUrl)
      .bodyValue(request)
      .retrieve()
      .bodyToMono(String::class.java)
      .block()
  }
}
