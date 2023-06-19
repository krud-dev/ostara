package dev.ostara.plugins.routes

import dev.ostara.param.model.ParamSchema.Companion.validate
import dev.ostara.param.model.Params
import dev.ostara.servicediscovery.handler.KubernetesServiceDiscoveryHandlerImpl
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.requestvalidation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import org.koin.ktor.ext.getKoin

fun Route.configureServiceDiscoveryRoutes() {
  val handlers = getKoin().getAll<KubernetesServiceDiscoveryHandlerImpl>()
  post("/api/service-discovery/{type}/discover") {
    try {
      val type = call.parameters["type"]?.lowercase()
      val handler = handlers.firstOrNull { it.type.lowercase() == type }
      if (handler == null) {
        call.respond(HttpStatusCode.NotFound, "No handler found for type $type")
        return@post
      }
      val parameters = try {
        val parameters: Map<String, String?> = call.receive()
        handler.validate(parameters)
        parameters
      } catch (e: RequestValidationException) {
        call.respond(HttpStatusCode.BadRequest, e.reasons)
        return@post
      } catch (e: Exception) {
        call.respond(HttpStatusCode.InternalServerError, e.message ?: "Unknown error")
        return@post
      }

      call.respond(
        handler.discoverInstances(Params.fromMap(handler.params, parameters))
      )
    } catch (e: Exception) {
      e.printStackTrace()
      call.respond(e.message ?: "Unknown error")
    }
  }
}
