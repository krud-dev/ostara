package dev.ostara.springclient

import dev.ostara.springclient.util.DEREGISTRATION_ENDPOINT
import dev.ostara.springclient.util.REGISTRATION_ENDPOINT
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import strikt.api.expect
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import java.util.concurrent.TimeUnit

abstract class AbstractOstaraAgentClientTest {
  protected val server = MockWebServer()
  protected val registrationRequest = RegistrationRequest(
    appName = "test-app",
    host = "localhost",
    managementUrl = "http://localhost:8080/actuator",
  )

  private lateinit var client: OstaraAgentClient

  abstract fun initClient(): OstaraAgentClient

  @BeforeEach
  internal fun setUp() {
    server.start()
    client = initClient()
  }

  @AfterEach
  internal fun tearDown() {
    server.shutdown()
  }

  @Test
  fun `register should POST the correct request`() {
    server.enqueue(
      MockResponse()
        .setResponseCode(201)
    )
    client.register(
      registrationRequest
    )
    val request = server.takeRequest(1000, TimeUnit.MILLISECONDS)

    expect {
      that(request)
        .isNotNull()
      that(request!!.path)
        .isEqualTo(REGISTRATION_ENDPOINT)
      that(
        request.method
      )
        .isEqualTo("POST")
      that(
        request.getHeader("content-type")
      )
        .isEqualTo("application/json")
      that(
        request.body.readUtf8()
      )
        .isEqualTo("{\"appName\":\"test-app\",\"host\":\"localhost\",\"managementUrl\":\"http://localhost:8080/actuator\"}")
    }
  }

  @Test
  fun `deregister should POST the correct request`() {
    server.enqueue(
      MockResponse()
        .setResponseCode(204)
    )
    client.deregister(
      registrationRequest
    )
    val request = server.takeRequest(1000, TimeUnit.MILLISECONDS)

    expect {
      that(request)
        .isNotNull()
      that(request!!.path)
        .isEqualTo(DEREGISTRATION_ENDPOINT)
      that(
        request.method
      )
        .isEqualTo("POST")
      that(
        request.getHeader("content-type")
      )
        .isEqualTo("application/json")
      that(
        request.body.readUtf8()
      )
        .isEqualTo("{\"appName\":\"test-app\",\"host\":\"localhost\",\"managementUrl\":\"http://localhost:8080/actuator\"}")
    }
  }
}
