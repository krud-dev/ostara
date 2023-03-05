package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Authenticator
import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

abstract class AbstractRetryableAuthenticator(
    private val retryCount: Int = 3
) : Authenticator {
    abstract fun authenticateInner(route: Route?, response: Response): Request?

    final override fun authenticate(route: Route?, response: Response): Request? {
        if (response.previousCount() >= retryCount) {
            return null
        }
        return authenticateInner(route, response)
    }

    private fun Response.previousCount(): Int {
        var count = 0
        var previous = this.priorResponse
        while (previous != null) {
            count++
            previous = previous.priorResponse
        }
        return count
    }
}