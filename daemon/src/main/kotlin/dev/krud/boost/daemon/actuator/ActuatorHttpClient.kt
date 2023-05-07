package dev.krud.boost.daemon.actuator

import dev.krud.boost.daemon.actuator.model.BeansActuatorResponse
import dev.krud.boost.daemon.actuator.model.CacheActuatorResponse
import dev.krud.boost.daemon.actuator.model.CachesActuatorResponse
import dev.krud.boost.daemon.actuator.model.ConfigPropsActuatorResponse
import dev.krud.boost.daemon.actuator.model.EnvActuatorResponse
import dev.krud.boost.daemon.actuator.model.EnvPropertyActuatorResponse
import dev.krud.boost.daemon.actuator.model.FlywayActuatorResponse
import dev.krud.boost.daemon.actuator.model.HealthActuatorResponse
import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.actuator.model.IntegrationGraphActuatorResponse
import dev.krud.boost.daemon.actuator.model.LiquibaseActuatorResponse
import dev.krud.boost.daemon.actuator.model.LoggerActuatorResponse
import dev.krud.boost.daemon.actuator.model.LoggersActuatorResponse
import dev.krud.boost.daemon.actuator.model.MappingsActuatorResponse
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
import dev.krud.boost.daemon.okhttp.ProgressListener
import java.io.InputStream

interface ActuatorHttpClient {
    fun testConnection(): TestConnectionResponse

    fun endpoints(): Result<Set<String>>

    /**
     * Health
     */

    fun health(): Result<HealthActuatorResponse>

    fun healthComponent(component: String): Result<HealthActuatorResponse>

    /**
     * Info
     */

    fun info(): Result<InfoActuatorResponse>

    /**
     * Caching
     */

    fun caches(): Result<CachesActuatorResponse>

    fun cache(cacheName: String): Result<CacheActuatorResponse>

    fun evictAllCaches(): Result<Unit>

    fun evictCache(cacheName: String): Result<Unit>

    /**
     * Beans
     */

    fun beans(): Result<BeansActuatorResponse>

    /**
     * Mappings
     */

    fun mappings(): Result<MappingsActuatorResponse>

    /**
     * Logfile
     */

    fun logfile(start: Long? = null, end: Long? = null): Result<String>

    /**
     * Metrics
     */

    fun metrics(): Result<MetricsActuatorResponse>

    fun metric(metricName: String, tags: Map<String, String> = emptyMap()): Result<MetricActuatorResponse>

    /**
     * Shutdown
     */

    // TODO: Write tests
    fun shutdown(): Result<Unit>

    /**
     * Env
     */

    fun env(): Result<EnvActuatorResponse>

    fun envProperty(key: String): Result<EnvPropertyActuatorResponse>

    /**
     * Configprops
     */

    fun configProps(): Result<ConfigPropsActuatorResponse>

    /**
     * Flyway
     */

    fun flyway(): Result<FlywayActuatorResponse>

    /**
     * Liquibase
     */

    fun liquibase(): Result<LiquibaseActuatorResponse>

    /**
     * Thread dump
     */

    fun threadDump(): Result<ThreadDumpActuatorResponse>

    /**
     * Heap dump
     */

    // TODO: Write tests
    fun heapDump(progressListener: ProgressListener = { _, _, _ -> }): Result<InputStream>

    /**
     * Loggers
     */

    fun loggers(): Result<LoggersActuatorResponse>

    fun logger(loggerOrGroupName: String): Result<LoggerActuatorResponse>

    fun updateLogger(loggerOrGroupName: String, level: String?): Result<Unit>

    /**
     * Integration Graph
     */

    fun integrationGraph(): Result<IntegrationGraphActuatorResponse>

    /**
     * Scheduled tasks
     */

    fun scheduledTasks(): Result<ScheduledTasksActuatorResponse>

    /**
     * Quartz
     */

    fun quartz(): Result<QuartzActuatorResponse>

    fun quartzJobs(): Result<QuartzJobsResponse>

    fun quartzJobsByGroup(group: String): Result<QuartzJobsByGroupResponse>

    fun quartzJob(group: String, name: String): Result<QuartzJobResponse>

    fun quartzTriggers(): Result<QuartzTriggersResponse>

    fun quartzTriggersByGroup(group: String): Result<QuartzTriggersByGroupResponse>

    fun quartzTrigger(group: String, name: String): Result<QuartzTriggerResponse>
}