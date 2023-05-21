package dev.krud.boost.daemon.actuator

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.KotlinModule
import dev.krud.boost.daemon.actuator.model.*
import dev.krud.boost.daemon.exception.*
import dev.krud.boost.daemon.jackson.MultiDateParsingModule
import dev.krud.boost.daemon.okhttp.ProgressListener
import dev.krud.boost.daemon.okhttp.ProgressResponseBody
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.web.server.ResponseStatusException
import java.io.InputStream
import java.net.ConnectException
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.SSLException
import javax.net.ssl.X509TrustManager

class ActuatorHttpClientImpl(
    private val baseUrl: String,
    private val authenticator: Authenticator = Authenticator.NONE,
    private val disableSslVerification: Boolean = false,
) : ActuatorHttpClient {
    internal val objectMapper = ObjectMapper().apply {
        registerModule(JavaTimeModule())
        registerModule(KotlinModule.Builder().build())
        registerModule(
            MultiDateParsingModule()
        )
        configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
    }

    private val baseHttpUrl: HttpUrl = baseUrl.toHttpUrl()

    override fun testConnection(): TestConnectionResponse {
        val rootCall = buildRequest(
            baseHttpUrl,
            "GET"
        )
        val response = runRequest(rootCall)
            .fold(
                onSuccess = { it },
                onFailure = {
                    return when (it) {
                        is ResponseStatusException -> {
                            TestConnectionResponse(
                                it.statusCode.value(),
                                it.message,
                                false,
                                false
                            )
                        }
                        is SSLException -> {
                            TestConnectionResponse(
                                -3,
                                it.message,
                                false,
                                false
                            )
                        }

                        else -> {
                            TestConnectionResponse(
                                -1,
                                it.message,
                                false,
                                false
                            )
                        }
                    }
                }
            )

        if (!response.isSuccessful) {
            return TestConnectionResponse(
                response.code,
                response.bodyAsStringAndClose(),
                false,
                false
            )
        } else {
            response.body?.close()
        }
        val validActuator = endpoints().fold(
            onSuccess = { it.isNotEmpty() },
            onFailure = { false }
        )
        return TestConnectionResponse(
            response.code,
            null,
            validActuator,
            true
        )
    }

    override fun endpoints(): Result<Set<String>> = runCatching {
        doGet<EndpointsActuatorResponse>(baseHttpUrl)
            .getOrThrow()
            .links
            .map { it.key }
            .toSet()
    }

    /**
     * Health
     */

    override fun health(): Result<HealthActuatorResponse> = doGet(asUrl("health"))

    override fun healthComponent(component: String): Result<HealthActuatorResponse> = doGet(asUrl("health", component))

    /**
     * Info
     */

    override fun info(): Result<InfoActuatorResponse> = doGet(asUrl("info"))

    /**
     * Caching
     */

    override fun caches(): Result<CachesActuatorResponse> = doGet(asUrl("caches"))

    override fun cache(cacheName: String): Result<CacheActuatorResponse> = doGet(asUrl("caches", cacheName))

    override fun evictAllCaches() = doDelete<Unit>(asUrl("caches"))

    override fun evictCache(cacheName: String) = doDelete<Unit>(asUrl("caches", cacheName))

    /**
     * Beans
     */

    override fun beans(): Result<BeansActuatorResponse> = doGet(asUrl("beans"))

    /**
     * Mappings
     */
    override fun mappings(): Result<MappingsActuatorResponse> = doGet(asUrl("mappings"))

    /**
     * Logfile
     */

    // TODO: Write tests
    override fun logfile(start: Long?, end: Long?): Result<String> = doGet(asUrl("logfile")) {
        // Both are optional, unless 1 is specified, throw.
        start?.let {
            requireNotNull(end) { "end must be specified if start is specified" }
        }
        end?.let {
            requireNotNull(start) { "start must be specified if end is specified" }
        }

        if (start != null && end != null) {
            addHeader("Range", "bytes=$start-$end")
        }
    }

    /**
     * Metrics
     */

    override fun metrics(): Result<MetricsActuatorResponse> = doGet(asUrl("metrics"))

    override fun metric(metricName: String, tags: Map<String, String>): Result<MetricActuatorResponse> =
        doGet(
            asUrl("metrics", metricName) {
                tags.forEach { (key, value) ->
                    addQueryParameter("tag", "$key:$value")
                }
            }
        )

    /**
     * Shutdown
     */

    // TODO: Write tests
    override fun shutdown(): Result<Unit> = doPost(asUrl("shutdown"))

    /**
     * Env
     */

    override fun env(): Result<EnvActuatorResponse> = doGet(asUrl("env"))

    override fun envProperty(key: String): Result<EnvPropertyActuatorResponse> = doGet(asUrl("env", key))

    /**
     * Configprops
     */

    override fun configProps(): Result<ConfigPropsActuatorResponse> = doGet(asUrl("configprops"))

    /**
     * Flyway
     */

    override fun flyway(): Result<FlywayActuatorResponse> = doGet(asUrl("flyway"))

    /**
     * Liquibase
     */

    override fun liquibase(): Result<LiquibaseActuatorResponse> = doGet(asUrl("liquibase"))

    /**
     * Thread dump
     */

    override fun threadDump(): Result<ThreadDumpActuatorResponse> = doGet(asUrl("threaddump"))

    /**
     * Heap dump
     */

    // TODO: Write tests
    override fun heapDump(progressListener: ProgressListener): Result<InputStream> = runCatching {
        val client = getClient() {
            addNetworkInterceptor { chain ->
                val originalResponse: Response = chain.proceed(chain.request())
                originalResponse
                    .newBuilder()
                    .body(ProgressResponseBody(originalResponse.body!!, progressListener))
                    .build()
            }
        }
        val request = Request.Builder()
            .url(asUrl("heapdump"))
            .build()
        val response = client.newCall(request).execute()
        response.bodyAsByteArrayAndClose()?.inputStream() ?: throwInternalServerError("Response body of heapdump was null")
    }

    /**
     * Loggers
     */

    override fun loggers(): Result<LoggersActuatorResponse> = doGet(asUrl("loggers"))

    override fun logger(loggerOrGroupName: String): Result<LoggerActuatorResponse> = doGet(asUrl("loggers", loggerOrGroupName))

    override fun updateLogger(loggerOrGroupName: String, level: String?): Result<Unit> = doPost(
        asUrl("loggers", loggerOrGroupName),
        objectMapper.writeValueAsString(
            LoggerUpdateRequest(level)
        ).toRequestBody("application/json".toMediaType())
    )

    /**
     * Integration Graph
     */

    override fun integrationGraph(): Result<IntegrationGraphActuatorResponse> = doGet(asUrl("integrationgraph"))

    /**
     * Scheduled tasks
     */

    override fun scheduledTasks(): Result<ScheduledTasksActuatorResponse> = doGet(asUrl("scheduledtasks"))

    /**
     * Quartz
     */

    override fun quartz(): Result<QuartzActuatorResponse> = doGet(asUrl("quartz"))

    override fun quartzJobs(): Result<QuartzJobsResponse> = doGet(asUrl("quartz", "jobs"))

    override fun quartzJobsByGroup(group: String): Result<QuartzJobsByGroupResponse> = doGet(asUrl("quartz", "jobs", group))

    override fun quartzJob(group: String, name: String): Result<QuartzJobResponse> = doGet(asUrl("quartz", "jobs", group, name))

    override fun quartzTriggers(): Result<QuartzTriggersResponse> = doGet(asUrl("quartz", "triggers"))

    override fun quartzTriggersByGroup(group: String): Result<QuartzTriggersByGroupResponse> = doGet(asUrl("quartz", "triggers", group))

    override fun quartzTrigger(group: String, name: String): Result<QuartzTriggerResponse> = doGet(asUrl("quartz", "triggers", group, name))

    override fun togglz() = doGet<List<TogglzFeatureActuatorResponse>>(asUrl("togglz"))

    override fun togglzFeature(featureName: String) = doGet<TogglzFeatureActuatorResponse>(asUrl("togglz", featureName))

    override fun updateTogglzFeature(featureName: String, enabled: Boolean) = doPost<TogglzFeatureActuatorResponse>(
        asUrl("togglz", featureName),
        objectMapper.writeValueAsString(
            TogglzFeatureUpdateRequest(featureName, enabled)
        ).toRequestBody("application/json".toMediaType())
    )

    private inline fun <reified Type> doGet(url: HttpUrl, build: Request.Builder.() -> Unit = {}): Result<Type> =
        doRequest(url, "GET", null, build)

    private inline fun <reified Type> doPost(url: HttpUrl, requestBody: RequestBody? = null, build: Request.Builder.() -> Unit = {}): Result<Type> =
        doRequest(url, "POST", requestBody, build)

    private inline fun <reified Type> doDelete(url: HttpUrl, build: Request.Builder.() -> Unit = {}): Result<Type> = doRequest(url, "DELETE", null, build)

    private inline fun <reified Type> doRequest(
        url: HttpUrl,
        method: String,
        requestBody: RequestBody? = null,
        build: Request.Builder.() -> Unit = {}
    ): Result<Type> = runCatching {
        val request = buildRequest(url, method, requestBody, build)
        val response = runRequest(request).getOrThrow()
        if (Type::class == Unit::class) {
            response.body?.close()
            Unit as Type
        } else {
            val responseBody = response.bodyAsStringAndClose()
            if (responseBody == null) {
                throwInternalServerError("Actuator response body is null: $request")
            } else {
                val typeReference = object : TypeReference<Type>() {}
                objectMapper.readValue(responseBody, typeReference)
            }
        }
    }

    private fun runRequest(request: Request): Result<Response> = runCatching {
        getClient().newCall(request).execute()
    }
        .mapCatching { response ->
            if (!response.isSuccessful) {
                response.throwStatusException()
            }
            response
        }
        .recoverCatching {
            when (it) {
                is ConnectException -> throwServiceUnavailable("Actuator unreachable: $request")
                is IllegalArgumentException -> throwBadRequest("Actuator request failed: $request")
                is ResponseStatusException -> throw it
                is SSLException -> throw it
                else -> throwInternalServerError("Actuator request failed: $request")
            }
        }

    private inline fun buildRequest(
        url: HttpUrl,
        method: String,
        requestBody: RequestBody? = null,
        build: Request.Builder.() -> Unit = {}
    ): Request {
        return Request.Builder()
            .url(url)
            .method(method, requestBody)
            .apply(build)
            .build()
    }

    private fun asUrl(vararg segments: String, build: HttpUrl.Builder.() -> Unit = {}): HttpUrl =
        baseHttpUrl.newBuilder()
            .apply {
                segments.forEach { segment ->
                    addPathSegment(segment)
                }
            }
            .apply(build)
            .build()

    private fun Response.bodyAsStringAndClose(): String? {
        return body?.use {
            it.string()
        }
    }

    private fun Response.bodyAsByteArrayAndClose(): ByteArray? {
        return body?.use {
            it.bytes()
        }
    }

    private fun Response.throwStatusException() {
        if (isSuccessful) {
            return
        }

        val bodyString = bodyAsStringAndClose()
        when (code) {
            400 -> throwBadRequest("Bad request: $bodyString")
            401 -> throwUnauthorized("Unauthorized: $bodyString")
            403 -> throwForbidden("Forbidden: $bodyString")
            404 -> throwNotFound("Not found")
            500 -> throwInternalServerError("Internal server error: $bodyString")
            else -> throwInternalServerError("Actuator request failed: $bodyString")
        }
    }

    private fun getClient(block: OkHttpClient.Builder.() -> Unit = {}): OkHttpClient = OkHttpClient
        .Builder()
        .authenticator(authenticator)
        .proxyAuthenticator(authenticator)
        .apply(block)
        .apply {
            if (disableSslVerification) {
                val sslContext: SSLContext = SSLContext.getInstance("SSL")
                sslContext.init(null, arrayOf(TRUST_MANAGER), SecureRandom())
                sslSocketFactory(
                    sslContext.socketFactory,
                    TRUST_MANAGER
                )
                hostnameVerifier { _, _ -> true }
            }
        }
        .build()

    companion object {
        private val TRUST_MANAGER = object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<out X509Certificate>?, authType: String?) {
                // no-op
            }

            override fun checkServerTrusted(chain: Array<out X509Certificate>?, authType: String?) {
                // no-op
            }

            override fun getAcceptedIssuers(): Array<X509Certificate> {
                return emptyArray()
            }
        }
    }
}