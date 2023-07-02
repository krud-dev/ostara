package dev.ostara.agent.routes

import com.moczul.ok2curl.CurlInterceptor
import com.moczul.ok2curl.logger.Logger
import dev.ostara.agent.service.ServiceDiscoveryService
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
import org.koin.ktor.ext.inject

private const val INSTANCE_ID_HEADER = "X-Ostara-InstanceId" // Temporary
private val HEADERS_TO_REMOVE = listOf(INSTANCE_ID_HEADER, "Host", "User-Agent", "Connection")

@OptIn(InternalAPI::class)
fun Route.configureActuatorRoutes() {
  val serviceDiscoveryService by inject<ServiceDiscoveryService>()
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
      val instanceId = call.request.header(INSTANCE_ID_HEADER)
      if (instanceId == null) {
        call.respondText("Missing $INSTANCE_ID_HEADER header", status = HttpStatusCode.BadRequest)
        return@handle
      }
      val instance = serviceDiscoveryService.getDiscoveredInstanceById(instanceId)
      if (instance?.url == null) {
        call.respondText("Instance $instanceId not found", status = HttpStatusCode.NotFound)
        return@handle
      }

      val proxiedPath = call.parameters.getAll("proxiedPath").orEmpty().joinToString("/")

      val proxyRequest = HttpRequestBuilder()
      proxyRequest.headers.appendAll(call.request.headers.filter { key, _ -> key !in HEADERS_TO_REMOVE })
      proxyRequest.method = call.request.httpMethod
      call.receiveNullable<ByteArray>()?.let { proxyRequest.body = it }
      proxyRequest.url.takeFrom("${instance.url.removeSuffix("/")}/$proxiedPath".removeSuffix("/"))
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
