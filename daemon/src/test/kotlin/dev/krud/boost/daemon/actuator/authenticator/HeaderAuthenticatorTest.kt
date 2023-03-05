package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Protocol
import okhttp3.Request
import okhttp3.Response
import org.junit.jupiter.api.Test
import strikt.api.expectThat
import strikt.assertions.isEqualTo

class HeaderAuthenticatorTest {
    @Test
    fun `header authenticator should set correct header on request`() {
        val authenticator = HeaderAuthenticator("X-Test", "test")
        val request = Request.Builder()
            .url("http://localhost:8080")
            .get()
            .build()
        val response = Response.Builder()
            .protocol(Protocol.HTTP_1_1)
            .request(request)
            .code(401)
            .message("Unauthorized")
            .build()
        val newRequest = authenticator.authenticate(null, response)
        expectThat(
            newRequest?.header("X-Test")
        )
            .isEqualTo("test")
    }
}