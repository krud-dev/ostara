package dev.ostara.plugins.routes

import dev.ostara.model.AgentInfoDTO
import dev.ostara.model.ServiceDiscoveryStrategyDTO
import dev.ostara.servicediscovery.handler.KubernetesServiceDiscoveryHandlerImpl
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.getKoin

fun Route.configureInfoRoutes() {
  val handlers = getKoin().getAll<KubernetesServiceDiscoveryHandlerImpl>()
  get("/api/info") {
    call.respond(
      AgentInfoDTO(
        version = "0.0.1",
        serviceDiscoveryStrategies = handlers.map {
          ServiceDiscoveryStrategyDTO(
            type = it.type,
            params = it.params.toList()
          )
        }
      )
    )
  }
}
