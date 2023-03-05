package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class BearerTokenAuthenticator(
    private val token: String,
    retryCount: Int = 3
) : AbstractRetryableAuthenticator(retryCount) {
    override fun authenticateInner(route: Route?, response: Response): Request? {
        return response
            .request
            .newBuilder()
            .header("Authorization", "Bearer $token")
            .build()
    }
}