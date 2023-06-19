package dev.ostara

import dev.ostara.plugins.configureAuthentication
import dev.ostara.plugins.configureKoin
import dev.ostara.plugins.configureRouting
import dev.ostara.plugins.configureSerialization
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
