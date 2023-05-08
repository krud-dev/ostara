package dev.krud.ostara.inappdemo.api

import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationListener
import org.springframework.context.event.ContextRefreshedEvent
import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient
import java.lang.Exception
import kotlin.random.Random

@Component
class ApiRequester(
  @Value("\${server.port}")
  private val serverPort: Int
) : ApplicationListener<ContextRefreshedEvent>  {
  private val endpoints = listOf(
    Endpoint("/api/v1/products", HttpMethod.GET, 26),
    Endpoint("/api/v1/products", HttpMethod.POST, 14),
    Endpoint("/api/v1/products/{id}", HttpMethod.GET, 10),
    Endpoint("/api/v1/products/{id}", HttpMethod.PUT, 10),
    Endpoint("/api/v1/products/{id}", HttpMethod.DELETE, 10),
    Endpoint("/api/v1/orders", HttpMethod.GET, 25),
    Endpoint("/api/v1/orders", HttpMethod.POST, 5),
    Endpoint("/api/v1/orders/{id}", HttpMethod.GET, 0),
    Endpoint("/api/v1/orders/{id}", HttpMethod.PUT, 15),
    Endpoint("/api/v1/orders/{id}", HttpMethod.DELETE, 15),
    Endpoint("/api/v1/customers", HttpMethod.GET, 0),
    Endpoint("/api/v1/customers", HttpMethod.POST, 30),
    Endpoint("/api/v1/customers/{id}", HttpMethod.GET, 10),
    Endpoint("/api/v1/customers/{id}", HttpMethod.PUT, 10),
    Endpoint("/api/v1/customers/{id}", HttpMethod.DELETE, 10),
    Endpoint("/api/v1/invoices", HttpMethod.GET, 26),
    Endpoint("/api/v1/invoices", HttpMethod.POST, 24),
    Endpoint("/api/v1/invoices/{id}", HttpMethod.GET, 0),
    Endpoint("/api/v1/invoices/{id}", HttpMethod.PUT, 15),
    Endpoint("/api/v1/invoices/{id}", HttpMethod.DELETE, 15),
    Endpoint("/api/v1/payments", HttpMethod.GET, 15),
    Endpoint("/api/v1/payments", HttpMethod.POST, 15),
    Endpoint("/api/v1/payments/{id}", HttpMethod.GET, 25),
    Endpoint("/api/v1/payments/{id}", HttpMethod.PUT, 5),
    Endpoint("/api/v1/payments/{id}", HttpMethod.DELETE, 0),
    Endpoint("/api/v1/shipments", HttpMethod.GET, 15),
    Endpoint("/api/v1/shipments", HttpMethod.POST, 15),
  )

  override fun onApplicationEvent(event: ContextRefreshedEvent) {
    for (endpoint in endpoints) {
      endpoint.run()
    }
  }

  private fun Endpoint.run() {
    val uri = "http://localhost:${serverPort}" + uri.replace(
      "{id}", Random.nextInt(10000, 99999).toString()
    )
    val call = WebClient.create(
      uri
    )
      .method(method)

    for (i in 0 until timesToCall) {
      try {
        call.retrieve().toBodilessEntity().block()
      } catch (e: Exception) {
        println()
        // ignore
      }
    }
  }


  data class Endpoint(
    val uri: String,
    val method: HttpMethod,
    val timesToCall: Int
  )
}
