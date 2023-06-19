package dev.ostara.plugins

import dev.ostara.util.AGENT_KEY_HEADER
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.server.plugins.forwardedheaders.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.util.logging.*
import java.util.*

private val LOGGER = KtorSimpleLogger("AgentAuthentication")

class AgentAuthenticationConfiguration {
  /**
   * The API key that must be supplied in the [AGENT_KEY_HEADER] header
   */
  var apiKey: String = ""
}

val AgentAuthentication = createApplicationPlugin(name = "authentication", createConfiguration = ::AgentAuthenticationConfiguration) {
  if (this.pluginConfig.apiKey.isBlank()) {
    error("AgentAuthentication plugin requires an apiKey")
  }
  onCall { call ->
    val originScheme = call.request.origin.scheme
    val apiKey = call.request.header(AGENT_KEY_HEADER)
    if (originScheme != "https") {
      if (!apiKey.isNullOrBlank()) {
        call.respondText("$AGENT_KEY_HEADER header is only allowed over https", status = HttpStatusCode.BadRequest)
      }
      return@onCall
    }

    if (apiKey.isNullOrBlank()) {
      call.respondText("$AGENT_KEY_HEADER header is required", status = HttpStatusCode.Unauthorized)
      return@onCall
    }

    if (apiKey != this.pluginConfig.apiKey) {
      call.respondText("$AGENT_KEY_HEADER header is incorrect", status = HttpStatusCode.Unauthorized)
      return@onCall
    }
  }
}

fun Application.configureAuthentication() {
  install(ForwardedHeaders) // todo: conditionally add this plugin
  install(XForwardedHeaders) // todo: conditionally add this plugin
  install(AgentAuthentication) {
    val apiKeyFromEnv = environment.config.propertyOrNull("dev.ostara.agent.apiKey")?.getString()
    if (apiKeyFromEnv.isNullOrBlank()) {
      apiKey = UUID.randomUUID().toString()
      log.info("Agent API key not found in environment [ dev.ostara.agent.apiKey ], a temporary key will be generated...")
      log.info("Temporary Agent API key: $apiKey")
    } else {
      apiKey = apiKeyFromEnv
      log.info("Agent API key found in environment [ dev.ostara.agent.apiKey ]")
    }
  }
}
