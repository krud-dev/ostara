package dev.ostara.agent.plugins

import dev.ostara.agent.plugins.routes.configureActuatorRoutes
import dev.ostara.agent.plugins.routes.configureInfoRoutes
import dev.ostara.agent.plugins.routes.configureServiceDiscoveryRoutes
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.callloging.*
import io.ktor.server.plugins.requestvalidation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.slf4j.event.Level

fun Application.configureRouting() {
  install(CallLogging) {
    level = Level.DEBUG
    filter { call -> call.request.path().startsWith("/") }
  }
  install(StatusPages) {
    exception<Throwable> { call, cause ->
      when (cause) {
        is RequestValidationException -> call.respond(HttpStatusCode.BadRequest, cause.reasons.joinToString())
        else -> call.respond(HttpStatusCode.InternalServerError, cause.message ?: "Unknown error")
      }
    }
    status(HttpStatusCode.NotFound) { call, status ->
      call.respondText(text = "404 not found", status = HttpStatusCode.NotFound)
    }
  }
  routing {
    configureActuatorRoutes()
    configureInfoRoutes()
    configureServiceDiscoveryRoutes()
    get("/") {
      call.respondText("OK")
    }
  }
}
