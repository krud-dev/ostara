package dev.krud.ostara.inappdemo.api

import org.springframework.http.HttpMethod
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.client.WebClient

@Component
class ApiRequester(
) {
  private val endpoints = listOf(
    Endpoint(

    )
  )


  data class Endpoint(
    val uri: String,
    val method: HttpMethod
  )
}
