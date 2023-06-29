package dev.ostara.agent.routes

import dev.ostara.agent.model.AgentInfoDTO
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Route.configureInfoRoutes() {
  get("/api/info") {
    call.respond(
      AgentInfoDTO(
        version = "0.0.1"
      )
    )
  }
}
