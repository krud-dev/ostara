package dev.ostara.agent.model

data class RegistrationRequestDTO(
  val appName: String,
  val host: String,
  val managementUrl: String
)
