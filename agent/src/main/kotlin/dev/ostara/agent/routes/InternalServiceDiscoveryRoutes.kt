package dev.ostara.agent.routes

import dev.ostara.agent.servicediscovery.handler.InternalServiceDiscoveryHandlerImpl
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.configureInternalServiceDiscoveryRoutes() {
  val internalServiceDiscoveryHandler by inject<InternalServiceDiscoveryHandlerImpl>()
  post("/api/serviceDiscovery/internal/register") {
    val request = call.receive<InternalServiceDiscoveryHandlerImpl.Companion.RegistrationRequest>()
    internalServiceDiscoveryHandler.doRegister(request)
    call.respond(HttpStatusCode.Created)
  }
  post("/api/serviceDiscovery/internal/deregister") {
    val request = call.receive<InternalServiceDiscoveryHandlerImpl.Companion.RegistrationRequest>()
    internalServiceDiscoveryHandler.doUnregister(request)
    call.respond(HttpStatusCode.NoContent)
  }
}
