package dev.ostara.springclient

import dev.ostara.springclient.util.DEREGISTRATION_ENDPOINT
import dev.ostara.springclient.util.REGISTRATION_ENDPOINT
import org.springframework.http.HttpEntity
import org.springframework.http.HttpMethod
import org.springframework.web.client.RestTemplate

class OstaraAgentWebClient(
  private val baseUrl: String,
  private val restTemplate: RestTemplate
) : OstaraAgentClient {
  private val registrationUrl = "${baseUrl.removeSuffix("/")}$REGISTRATION_ENDPOINT"
  private val deregistrationUrl = "${baseUrl.removeSuffix("/")}$DEREGISTRATION_ENDPOINT}"

  override fun register(request: RegistrationRequest) = runCatching {
    restTemplate.exchange(
      registrationUrl,
      HttpMethod.POST,
      HttpEntity(request),
      String::class.java
    )
    return@runCatching
  }

  override fun deregister(request: RegistrationRequest) = runCatching {
    restTemplate.exchange(
      deregistrationUrl,
      HttpMethod.POST,
      HttpEntity(request),
      String::class.java
    )
    return@runCatching
  }
}
