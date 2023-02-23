package dev.krud.boost.daemon.actuator

import com.google.gson.GsonBuilder
import dev.krud.boost.daemon.actuator.model.*
import dev.krud.boost.daemon.exception.*
import okhttp3.*
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.boot.logging.LogLevel
import java.io.InputStream
import java.net.ConnectException

class ActuatorHttpClient(
    private val baseUrl: String,
    private val httpClient: OkHttpClient = OkHttpClient.Builder().build()
) {

    private val baseHttpUrl: HttpUrl = baseUrl.toHttpUrl()

    fun testConnection(): TestConnectionResponse {
        val rootCall = buildRequest(
            baseHttpUrl,
            "GET"
        )
        val response = runRequest(rootCall)
            .fold(
                onSuccess = { it },
                onFailure = { return TestConnectionResponse(0, "Failed to test connection: ${it.message}", false, false) }
            )

        if (!response.isSuccessful) {
            return TestConnectionResponse(
                response.code,
                response.body?.string(),
                false,
                false
            )
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

    fun endpoints(): Result<Set<String>> = runCatching {
        doGet<EndpointsActuatorResponse>(baseHttpUrl)
            .getOrThrow()
            .links
            .map { it.key }
            .toSet()
    }

    /**
     * Health
     */

    fun health(): Result<HealthActuatorResponse> = doGet(asUrl("health"))

    fun healthComponent(component: String): Result<HealthActuatorResponse> = doGet(asUrl("health", component))

    /**
     * Info
     */

    fun info(): Result<InfoActuatorResponse> = doGet(asUrl("info"))

    /**
     * Caching
     */

    fun caches(): Result<CachesActuatorResponse> = doGet(asUrl("caches"))

    fun cache(cacheName: String): Result<CacheActuatorResponse> = doGet(asUrl("caches", cacheName))

    fun evictAllCaches() = doDelete<Unit>(asUrl("caches"))

    fun evictCache(cacheName: String) = doDelete<Unit>(asUrl("caches", cacheName))

    /**
     * Beans
     */

    fun beans(): Result<BeansActuatorResponse> = doGet(asUrl("beans"))

    /**
     * Logfile
     */

    // TODO: Write tests
    fun logfile(start: Long? = null, end: Long? = null): Result<String> = doGet(asUrl("logfile")) {
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

    fun metrics(): Result<MetricsActuatorResponse> = doGet(asUrl("metrics"))

    fun metric(metricName: String, tags: Map<String, String> = emptyMap()): Result<MetricActuatorResponse> =
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
    fun shutdown(): Result<Unit> = doPost(asUrl("shutdown"))

    /**
     * Env
     */

    fun env(): Result<EnvActuatorResponse> = doGet(asUrl("env"))

    fun envProperty(key: String): Result<EnvPropertyActuatorResponse> = doGet(asUrl("env", key))

    /**
     * Configprops
     */

    fun configProps(): Result<ConfigPropsActuatorResponse> = doGet(asUrl("configprops"))

    /**
     * Flyway
     */

    fun flyway(): Result<FlywayActuatorResponse> = doGet(asUrl("flyway"))

    /**
     * Liquibase
     */

    fun liquibase(): Result<LiquibaseActuatorResponse> = doGet(asUrl("liquibase"))

    /**
     * Thread dump
     */

    fun threadDump(): Result<ThreadDumpActuatorResponse> = doGet(asUrl("threaddump"))

    /**
     * Heap dump
     */

    // TODO: Write tests
    fun heapDump(): Result<InputStream> = runCatching {
        val request = Request.Builder()
            .url(asUrl("heapdump"))
            .build()
        val response = httpClient.newCall(request).execute()
        response.body?.byteStream() ?: throwInternalServerError("Response body of heapdump was null")
    }

    /**
     * Loggers
     */

    fun loggers(): Result<LoggersActuatorResponse> = doGet(asUrl("loggers"))

    fun logger(loggerOrGroupName: String): Result<LoggerActuatorResponse> = doGet(asUrl("loggers", loggerOrGroupName))

    fun updateLogger(loggerOrGroupName: String, level: LogLevel?): Result<Unit> = doPost(
        asUrl("loggers", loggerOrGroupName),
        GSON.toJson(LoggerUpdateRequest(level)).toRequestBody("application/json".toMediaType())
    )

    /**
     * Integration Graph
     */

    fun integrationGraph(): Result<IntegrationGraphActuatorResponse> = doGet(asUrl("integrationgraph"))

    /**
     * Scheduled tasks
     */

    fun scheduledTasks(): Result<ScheduledTasksActuatorResponse> = doGet(asUrl("scheduledtasks"))

    /**
     * Quartz
     */

    fun quartz(): Result<QuartzActuatorResponse> = doGet(asUrl("quartz"))

    fun quartzJobs(group: String): Result<QuartzJobsResponse> = doGet(asUrl("quartz", "jobs", group))

    fun quartzJob(group: String, name: String): Result<QuartzJobResponse> = doGet(asUrl("quartz", "jobs", group, name))

    fun quartzTriggers(group: String): Result<QuartzTriggersResponse> = doGet(asUrl("quartz", "triggers", group))

    fun quartzTrigger(group: String, name: String): Result<QuartzTriggerResponse> = doGet(asUrl("quartz", "triggers", group, name))

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
        val responseBody = response.body?.string()
        if (responseBody == null) {
            throwInternalServerError("Actuator response body is null: $request")
        } else {
            GSON.fromJson(responseBody, Type::class.java)
        }
    }

    private fun runRequest(request: Request): Result<Response> = runCatching {
        httpClient.newCall(request).execute()
    }
        .mapCatching { response ->
            if (!response.isSuccessful) {
                when (response.code) {
                    404 -> throwNotFound("Endpoint ${request.url} not found")
                    else -> throwStatusCode(response.code, "Actuator request failed: $request")
                }
            }
            response
        }
        .recoverCatching {
            when (it) {
                is ConnectException -> throwServiceUnavailable("Actuator unreachable: $request")
                is IllegalArgumentException -> throwBadRequest("Actuator request failed: $request")
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

    companion object {
        private val GSON = GsonBuilder().create()
    }
}