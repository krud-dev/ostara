package dev.krud.boost.daemon.actuator

import com.google.gson.GsonBuilder
import dev.krud.boost.daemon.actuator.model.BeansActuatorResponse
import dev.krud.boost.daemon.actuator.model.CacheActuatorResponse
import dev.krud.boost.daemon.actuator.model.CachesActuatorResponse
import dev.krud.boost.daemon.actuator.model.ConfigPropsActuatorResponse
import dev.krud.boost.daemon.actuator.model.EndpointsActuatorResponse
import dev.krud.boost.daemon.actuator.model.EnvActuatorResponse
import dev.krud.boost.daemon.actuator.model.EnvPropertyActuatorResponse
import dev.krud.boost.daemon.actuator.model.FlywayActuatorResponse
import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.actuator.model.IntegrationGraphActuatorResponse
import dev.krud.boost.daemon.actuator.model.LiquibaseActuatorResponse
import dev.krud.boost.daemon.actuator.model.LoggerActuatorResponse
import dev.krud.boost.daemon.actuator.model.LoggerUpdateRequest
import dev.krud.boost.daemon.actuator.model.LoggersActuatorResponse
import dev.krud.boost.daemon.actuator.model.MetricActuatorResponse
import dev.krud.boost.daemon.actuator.model.MetricsActuatorResponse
import dev.krud.boost.daemon.actuator.model.QuartzActuatorResponse
import dev.krud.boost.daemon.actuator.model.QuartzJobResponse
import dev.krud.boost.daemon.actuator.model.QuartzJobsByGroupResponse
import dev.krud.boost.daemon.actuator.model.QuartzJobsResponse
import dev.krud.boost.daemon.actuator.model.QuartzTriggerResponse
import dev.krud.boost.daemon.actuator.model.QuartzTriggersByGroupResponse
import dev.krud.boost.daemon.actuator.model.QuartzTriggersResponse
import dev.krud.boost.daemon.actuator.model.ScheduledTasksActuatorResponse
import dev.krud.boost.daemon.actuator.model.TestConnectionResponse
import dev.krud.boost.daemon.actuator.model.ThreadDumpActuatorResponse
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.exception.throwServiceUnavailable
import dev.krud.boost.daemon.exception.throwStatusCode
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.springframework.boot.logging.LogLevel
import java.io.InputStream
import java.net.ConnectException

class ActuatorHttpClientImpl(
    private val baseUrl: String,
    private val httpClient: OkHttpClient = OkHttpClient.Builder().build()
) : ActuatorHttpClient {

    private val baseHttpUrl: HttpUrl = baseUrl.toHttpUrl()

    override fun testConnection(): TestConnectionResponse {
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
    override fun heapDump(): Result<InputStream> = runCatching {
        val request = Request.Builder()
            .url(asUrl("heapdump"))
            .build()
        val response = httpClient.newCall(request).execute()
        response.body?.byteStream() ?: throwInternalServerError("Response body of heapdump was null")
    }

    /**
     * Loggers
     */

    override fun loggers(): Result<LoggersActuatorResponse> = doGet(asUrl("loggers"))

    override fun logger(loggerOrGroupName: String): Result<LoggerActuatorResponse> = doGet(asUrl("loggers", loggerOrGroupName))

    override fun updateLogger(loggerOrGroupName: String, level: LogLevel?): Result<Unit> = doPost(
        asUrl("loggers", loggerOrGroupName),
        GSON.toJson(LoggerUpdateRequest(level)).toRequestBody("application/json".toMediaType())
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