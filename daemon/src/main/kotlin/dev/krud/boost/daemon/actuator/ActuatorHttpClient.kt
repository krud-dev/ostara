package dev.krud.boost.daemon.actuator

import com.google.gson.GsonBuilder
import com.google.gson.annotations.SerializedName
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import org.springframework.boot.logging.LogLevel
import java.io.InputStream

class ActuatorHttpClient(
  private val baseUrl: String,
  private val httpClient: OkHttpClient = OkHttpClient.Builder().build()
) {

  private val baseHttpUrl: HttpUrl = baseUrl.toHttpUrl()

  fun endpoints(): Set<String> = doGet<EndpointsResponse>(baseHttpUrl)
    .links
    .map { it.key }
    .toSet()

  /**
   * Health
   */

  fun health(): HealthResponse = doGet(asUrl("health"))

  fun healthComponent(component: String): HealthResponse = doGet(asUrl("health", component))

  /**
   * Info
   */

  fun info(): InfoResponse = doGet(asUrl("info"))

  /**
   * Caching
   */

  fun caches(): CachesResponse = doGet(asUrl("caches"))

  fun cache(cacheName: String): CacheResponse = doGet(asUrl("caches", cacheName))

  fun evictAllCaches() = doDelete<Unit>(asUrl("caches"))

  fun evictCache(cacheName: String) = doDelete<Unit>(asUrl("caches", cacheName))

  /**
   * Beans
   */

  fun beans(): BeansResponse = doGet(asUrl("beans"))

  /**
   * Logfile
   */

  // TODO: Write tests
  fun logfile(start: Long? = null, end: Long? = null): String = doGet(asUrl("logfile")) {
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

  fun metrics(): MetricsResponse = doGet(asUrl("metrics"))

  fun metric(metricName: String, tags: Map<String, String> = emptyMap()): MetricResponse =
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
  fun shutdown() = doPost<Unit>(asUrl("shutdown"))

  /**
   * Env
   */

  fun env(): EnvResponse = doGet(asUrl("env"))

  fun envProperty(key: String): EnvPropertyResponse = doGet(asUrl("env", key))

  /**
   * Configprops
   */

  fun configProps(): ConfigPropsResponse = doGet(asUrl("configprops"))

  /**
   * Flyway
   */

  fun flyway(): FlywayResponse = doGet(asUrl("flyway"))

  /**
   * Liquibase
   */

  fun liquibase(): LiquibaseResponse = doGet(asUrl("liquibase"))

  /**
   * Thread dump
   */

  fun threadDump(): ThreadDumpResponse = doGet(asUrl("threaddump"))

  /**
   * Heap dump
   */

  // TODO: Write tests
  fun heapDump(): InputStream {
    val request = Request.Builder()
      .url(asUrl("heapdump"))
      .build()
    val response = httpClient.newCall(request).execute()
    return requireNotNull(response.body?.byteStream()) { "Response body was null" }
  }

  /**
   * Loggers
   */

  fun loggers(): LoggersResponse = doGet(asUrl("loggers"))

  fun logger(loggerOrGroupName: String): LoggerResponse = doGet(asUrl("loggers", loggerOrGroupName))

  fun updateLogger(loggerOrGroupName: String, level: LogLevel?) = doPost<Unit>(
    asUrl("loggers", loggerOrGroupName),
    GSON.toJson(LoggerUpdateRequest(level)).toRequestBody("application/json".toMediaType())
  )

  data class EndpointsResponse(
    @SerializedName("_links")
    val links: Map<String, Link>
  ) {
    data class Link(
      val href: String,
      val templated: Boolean
    )
  }

  data class HealthResponse(
    val status: Status,
    val components: Map<String, Component>,
    val groups: List<String>?
  ) {
    enum class Status {
      UP, DOWN, OUT_OF_SERVICE, UNKNOWN
    }

    data class Component(
      val status: Status,
      val description: String?,
      val components: Map<String, Component>?,
      val details: Map<String, Any>
    )
  }

  data class InfoResponse(
    val build: Build?,
    val git: Git?
  ) {
    data class Build(
      val artifact: String,
      val group: String,
      val name: String,
      val version: String
    )

    data class Git(
      val branch: String,
      val commit: Commit
    ) {
      data class Commit(
        val id: String,
        val time: String
      )
    }
  }

  data class CachesResponse(
    val cacheManagers: Map<String, CacheManager>
  ) {
    data class CacheManager(
      val caches: Map<String, Cache>
    ) {
      data class Cache(
        val target: String
      )
    }
  }

  data class CacheResponse(
    val target: String,
    val name: String,
    val cacheManager: String
  )

  data class BeansResponse(
    val contexts: Map<String, Context>
  ) {
    data class Context(
      val beans: Map<String, Bean>
    ) {
      data class Bean(
        val aliases: List<String>,
        val scope: String,
        val type: String,
        val resource: String,
        val dependencies: List<String>
      )
    }
  }

  data class MetricsResponse(
    val names: List<String>
  )

  data class MetricResponse(
    val name: String,
    val description: String?,
    val baseUnit: String?,
    val availableTags: List<Tag>,
    val measurements: List<Measurement>
  ) {
    data class Measurement(
      val statistic: String,
      val value: Double
    )

    data class Tag(
      val tag: String,
      val values: List<String>
    )
  }

  data class EnvResponse(
    val activeProfiles: Set<String>,
    val propertySources: List<PropertySource>
  ) {
    data class PropertySource(
      val name: String,
      val properties: Map<String, Property>?
    ) {
      data class Property(
        val value: String,
        val origin: String?
      )
    }
  }

  data class EnvPropertyResponse(
    val property: Property,
    val activeProfiles: Set<String>,
    val propertySources: List<PropertySource>
  ) {
    data class Property(
      val value: String,
      val source: String
    )

    data class PropertySource(
      val name: String,
      val properties: Map<String, Property>?
    ) {
      data class Property(
        val value: String,
        val origin: String?
      )
    }
  }

  data class ConfigPropsResponse(
    val contexts: Map<String, Context>
  ) {
    data class Context(
      val beans: Map<String, Bean>,
      val parentId: String?
    ) {
      data class Bean(
        val prefix: String,
        val properties: Map<String, Any>,
        val inputs: Map<String, Any>
      )
    }
  }

  data class FlywayResponse(
    val contexts: Map<String, Context>
  ) {
    data class Context(
      val flywayBeans: Map<String, FlywayBean>
    ) {
      data class FlywayBean(
        val migrations: List<Migration>
      ) {
        data class Migration(
          val type: String,
          val checksum: Long,
          val version: String,
          val description: String,
          val script: String,
          val state: String,
          val installedBy: String,
          val installedOn: String,
          val installedRank: Int,
          val executionTime: Long
        )
      }
    }
  }

  data class LiquibaseResponse(
    val contexts: Map<String, Context>
  ) {
    data class Context(
      val liquibaseBeans: Map<String, LiquibaseBean>
    ) {
      data class LiquibaseBean(
        val changeSets: List<ChangeSet>
      ) {
        data class ChangeSet(
          val id: String,
          val checksum: String,
          val orderExecuted: Int,
          val author: String,
          val changeLog: String,
          val comments: String,
          val context: List<String>,
          val dateExecuted: String,
          val deploymentId: String,
          val description: String,
          val execType: String,
          val labels: List<String>,
          val tag: String?
        )
      }
    }
  }

  data class ThreadDumpResponse(
    val threads: List<Thread>
  ) {
    data class Thread(
      val threadName: String,
      val threadId: Long,
      val blockedTime: Long,
      val blockedCount: Long,
      val waitedTime: Long,
      val waitedCount: Long,
      val lockName: String,
      val lockOwnerId: Long,
      val lockOwnerName: String?,
      val daemon: Boolean,
      val inNative: Boolean,
      val suspended: Boolean,
      val threadState: String,
      val priority: Int,
      val stackTrace: List<StackTraceFrame>,
      val lockedMonitors: List<LockedMonitor>,
      val lockedSynchronizers: List<LockedSynchronizer>
    ) {
      data class StackTraceFrame(
        val classLoaderName: String?,
        val moduleName: String,
        val moduleVersion: String,
        val fileName: String,
        val className: String,
        val methodName: String,
        val lineNumber: Int,
        val nativeMethod: Boolean
      )

      data class LockedMonitor(
        val className: String,
        val identityHashCode: Int,
        val lockedStackDepth: Int,
        val lockedStackFrame: StackTraceFrame
      )

      data class LockedSynchronizer(
        val className: String,
        val identityHashCode: Int
      )
    }
  }

  data class LoggersResponse(
    val levels: List<LogLevel>,
    val loggers: Map<String, Logger>
  ) {
    data class Logger(
      val effectiveLevel: LogLevel,
      val configuredLevel: LogLevel?
    )
  }

  data class LoggerResponse(
    val effectiveLevel: LogLevel?,
    val configuredLevel: LogLevel?,
    val members: List<String>?
  )

  data class LoggerUpdateRequest(val configuredLevel: LogLevel?)

  private inline fun <reified Type> doGet(url: HttpUrl, build: Request.Builder.() -> Unit = {}): Type =
    doRequest(url, "GET", null, build)

  private inline fun <reified Type> doPost(url: HttpUrl, requestBody: RequestBody? = null, build: Request.Builder.() -> Unit = {}): Type =
    doRequest(url, "POST", requestBody, build)

  private inline fun <reified Type> doDelete(url: HttpUrl, build: Request.Builder.() -> Unit = {}): Type =
    doRequest(url, "DELETE", null, build)

  private inline fun <reified Type> doRequest(
    url: HttpUrl,
    method: String,
    requestBody: RequestBody? = null,
    build: Request.Builder.() -> Unit = {}
  ): Type {
    val request = Request.Builder()
      .url(url)
      .method(method, requestBody)
      .apply(build)
      .build()
    val response = httpClient.newCall(request).execute()
    val responseBody = response.body?.string()

    return GSON.fromJson(responseBody, Type::class.java)
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
