package dev.ostara

import dev.ostara.plugins.AgentAuthentication
import dev.ostara.plugins.configureAuthentication
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.config.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.testing.*
import org.junit.Test
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.isEqualTo

class AgentAuthenticationTest {
  @Test
  fun `authentication should return bad request if authentication header was supplied over http`() =
    authTestApplication {
      val response = client.get("/") {
        header("X-Ostara-Key", "test")
      }
      expectThat(response.status).isEqualTo(HttpStatusCode.BadRequest)
      expectThat(response.bodyAsText()).isEqualTo("X-Ostara-Key header is only allowed over https")
    }

  @Test
  fun `authentication should return unauthorized if authentication header was not supplied over https`() =
    authTestApplication {
      val response = client.get("/") {
        header("X-Forwarded-Proto", "https")
      }
      expectThat(response.status).isEqualTo(HttpStatusCode.Unauthorized)
      expectThat(response.bodyAsText()).isEqualTo("X-Ostara-Key header is required")
    }

  @Test
  fun `authentication should return unauthorized if authentication header was incorrect`() = authTestApplication {
    val response = client.get("/") {
      header("X-Forwarded-Proto", "https")
      header("X-Ostara-Key", "incorrect")
    }
    expectThat(response.status).isEqualTo(HttpStatusCode.Unauthorized)
    expectThat(response.bodyAsText()).isEqualTo("X-Ostara-Key header is incorrect")
  }

  @Test
  fun `authentication should return ok if authentication header was correct`() = authTestApplication {
    routing {
      get("/") {
        call.respondText("OK")
      }
    }
    val response = client.get("/") {
      header("X-Forwarded-Proto", "https")
      header("X-Ostara-Key", "test")
    }
    expectThat(response.status).isEqualTo(HttpStatusCode.OK)
    expectThat(response.bodyAsText()).isEqualTo("OK")
  }

  @Test
  fun `authentication should return ok if no authentication header was supplied over http`() = authTestApplication {
    routing {
      get("/") {
        call.respondText("OK")
      }
    }
    val response = client.get("/")
    expectThat(response.status).isEqualTo(HttpStatusCode.OK)
    expectThat(response.bodyAsText()).isEqualTo("OK")
  }

  @Test
  fun `agent authentication plugin should throw if no api key is supplied`() {
    expectThrows<IllegalStateException> {
      testApplication {
        application {
          install(AgentAuthentication) {
            apiKey = ""
          }
        }
      }
    }.and {
      get { message }.isEqualTo("AgentAuthentication plugin requires an apiKey")
    }
  }

  private fun authTestApplication(builder: suspend ApplicationTestBuilder.() -> Unit) = testApplication {
    environment {
      config = MapApplicationConfig(
        "dev.ostara.agent.apiKey" to "test"
      )
    }
    application {
      configureAuthentication()
    }
    builder()
  }
}
