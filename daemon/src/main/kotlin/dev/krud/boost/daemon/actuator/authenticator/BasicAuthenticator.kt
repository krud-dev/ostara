package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Authenticator
import okhttp3.Credentials
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class BasicAuthenticator(
    private val username: String,
    private val password: String
) : Authenticator {
    private val credentials: String = Credentials.basic(username, password)
    override fun authenticate(route: Route?, response: Response): Request? {
        return response
            .request
            .newBuilder()
            .header("Authorization", credentials)
            .build()
    }
}