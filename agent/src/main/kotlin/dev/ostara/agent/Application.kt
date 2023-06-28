package dev.ostara.agent

import dev.ostara.agent.plugins.configureAuthentication
import dev.ostara.agent.plugins.configureKoin
import dev.ostara.agent.plugins.configureRouting
import dev.ostara.agent.plugins.configureSerialization
import io.ktor.server.application.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
  embeddedServer(
    Netty,
    port = 14444,
    host = "0.0.0.0",
    module = Application::module,
    watchPaths = listOf(
      "classes",
      "resources"
    )
  )

    .start(wait = true)
}

fun Application.module() {
  configureKoin()
  configureAuthentication()
  configureSerialization()
  configureRouting()

}
