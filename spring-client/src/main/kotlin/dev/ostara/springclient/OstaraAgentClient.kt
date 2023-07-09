package dev.ostara.springclient

interface OstaraAgentClient {
  fun register(request: RegistrationRequest): Result<Unit>
  fun deregister(request: RegistrationRequest): Result<Unit>
}

