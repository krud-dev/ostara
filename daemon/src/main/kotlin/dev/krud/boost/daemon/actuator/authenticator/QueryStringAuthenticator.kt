package dev.krud.boost.daemon.actuator.authenticator

import okhttp3.Request
import okhttp3.Response
import okhttp3.Route

class QueryStringAuthenticator(
    private val key: String,
    private val value: String,
    retryCount: Int = 3
) : AbstractRetryableAuthenticator(retryCount) {
    override fun authenticateInner(route: Route?, response: Response): Request? {
        val url = response.request.url.newBuilder()
            .addQueryParameter(key, value)
            .build()
        return response.request.newBuilder()
            .url(url)
            .build()
    }
}