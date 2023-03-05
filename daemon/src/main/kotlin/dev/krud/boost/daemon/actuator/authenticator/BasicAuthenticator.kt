package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Credentials
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class BasicAuthenticator(
    private val username: String,
    private val password: String,
    retryCount: Int = 3
) : AbstractRetryableAuthenticator(retryCount) {
    private val credentials: String = Credentials.basic(username, password)

    override fun authenticateInner(route: Route?, response: Response): Request? {
        return response
            .request
            .newBuilder()
            .header("Authorization", credentials)
            .build()
    }
}