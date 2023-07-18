package dev.ostara.springclient

import org.springframework.web.reactive.function.client.WebClient

class OstaraAgentReactiveClientTest : AbstractOstaraAgentClientTest() {
  override fun initClient(): OstaraAgentClient {
    return OstaraAgentReactiveClient(
      baseUrl = server.url("/").toString(),
      webClient = WebClient.create()
    )
  }
}
