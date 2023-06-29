package dev.ostara.agent.routes

import dev.ostara.agent.service.ServiceDiscoveryService
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.inject

fun Route.configureInstancesRoutes() {
  val serviceDiscoveryService by inject<ServiceDiscoveryService>()
  get("/api/instances") {
    call.respond(
      serviceDiscoveryService.getDiscoveredInstances()
    )
  }
}
