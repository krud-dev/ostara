package dev.ostara.springclient

import org.springframework.web.client.RestTemplate

class OstaraAgentWebClientTest : AbstractOstaraAgentClientTest() {
  override fun initClient(): OstaraAgentClient {
    return OstaraAgentWebClient(
      baseUrl = server.url("/").toString(),
      restTemplate = RestTemplate()
    )
  }
}
