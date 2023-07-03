package dev.ostara.springclient

data class RegistrationRequest(
  val appName: String,
  val host: String,
  val managementUrl: String
)
