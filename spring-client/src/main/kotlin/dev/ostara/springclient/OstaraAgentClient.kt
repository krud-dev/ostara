package dev.ostara.springclient

interface OstaraAgentClient {
  fun register(request: RegistrationRequest)
  fun deregister(request: RegistrationRequest)
}

