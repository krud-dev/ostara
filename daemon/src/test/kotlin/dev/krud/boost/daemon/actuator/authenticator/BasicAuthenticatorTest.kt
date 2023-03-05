package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Protocol
import okhttp3.Request
import okhttp3.Response
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class BasicAuthenticatorTest {
    @Test
    fun `authenticate should return a request with the correct basic auth header`() {
        val authenticator = BasicAuthenticator("username", "password")
        val request = Request.Builder()
            .url("http://localhost:8080")
            .get()
            .build()
        val expected = "Basic dXNlcm5hbWU6cGFzc3dvcmQ=" // base64 encoded "username:password"
        val response = Response.Builder()
            .protocol(Protocol.HTTP_1_1)
            .request(request)
            .code(401)
            .message("Unauthorized")
            .build()
        val newRequest = authenticator.authenticate(null, response)
        expectThat(
            newRequest?.header("Authorization")
        )
            .isEqualTo(expected)
    }

    @Test
    fun `authenticator should return null if prior response count crosses threshold`() {
        val authenticator = BasicAuthenticator("username", "password", 1)
        val request = Request.Builder()
            .url("http://localhost:8080")
            .get()
            .build()
        val response = Response.Builder()
            .protocol(Protocol.HTTP_1_1)
            .request(request)
            .priorResponse(
                Response.Builder()
                    .protocol(Protocol.HTTP_1_1)
                    .request(request)
                    .code(401)
                    .message("Unauthorized")
                    .build()
            )
            .code(401)
            .message("Unauthorized")
            .build()
        val newRequest = authenticator.authenticate(null, response)
        expectThat(
            newRequest
        )
            .isEqualTo(null)
    }
}