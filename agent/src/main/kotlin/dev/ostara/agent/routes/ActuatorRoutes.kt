package dev.ostara.agent.routes

import com.moczul.ok2curl.CurlInterceptor
import com.moczul.ok2curl.logger.Logger
import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.request.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private const val INSTANCE_BASE_URL_HEADER = "X-Actuator-Base-Url" // Temporary
private val HEADERS_TO_REMOVE = listOf(INSTANCE_BASE_URL_HEADER, INSTANCE_BASE_URL_HEADER, "Host", "User-Agent", "Connection")

@OptIn(InternalAPI::class)
fun Route.configureActuatorRoutes() {
  val client = HttpClient(OkHttp) {
    engine {
      this.addInterceptor(CurlInterceptor(object : Logger {
        override fun log(message: String) {
          println(message)
        }
      }))
    }
  }

  route("/api/actuator/proxy/{proxiedPath...}") {
    handle {
      val baseUrl = call.request.header(INSTANCE_BASE_URL_HEADER)
      if (baseUrl == null) {
        call.respondText("Missing $INSTANCE_BASE_URL_HEADER header", status = HttpStatusCode.BadRequest)
        return@handle
      }

      val proxiedPath = call.parameters.getAll("proxiedPath").orEmpty().joinToString("/")

      val proxyRequest = HttpRequestBuilder()
      proxyRequest.headers.appendAll(call.request.headers.filter { key, _ -> key !in HEADERS_TO_REMOVE })
      proxyRequest.method = call.request.httpMethod
      call.receiveNullable<ByteArray>()?.let { proxyRequest.body = it }
      proxyRequest.url.takeFrom("${baseUrl.removeSuffix("/")}/$proxiedPath".removeSuffix("/"))
      val response = client.request(proxyRequest)
      call.respondOutputStream(response.contentType(), status = response.status) {
        withContext(Dispatchers.IO) {
          while (true) {
            val buffer = ByteArray(1024 * 16)
            val count = response.content.readAvailable(buffer, 0, buffer.size)
            if (count == -1) break
            write(buffer, 0, count)
          }
        }
      }
    }
  }
}
