package dev.krud.boost.daemon.configuration.application.logger

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.logger.ro.ApplicationLoggerRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import dev.krud.boost.daemon.configuration.instance.logger.InstanceLoggerService
import dev.krud.boost.daemon.exception.throwBadRequest
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import org.springframework.boot.logging.LogLevel
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationLoggerService(
    private val applicationService: ApplicationService,
    private val instanceLoggerService: InstanceLoggerService,
    private val instanceHealthService: InstanceHealthService
) {
    fun getLoggers(applicationId: UUID): List<ApplicationLoggerRO> {
        val application = applicationService.getApplicationOrThrow(applicationId)
        applicationService.hasAbilityOrThrow(application, InstanceAbility.LOGGERS)
        val loggers = if (application.instanceCount > MAX_INSTANCE_COUNT) {
            val instance = applicationService.getApplicationInstances(application.id)
                .firstOrNull() ?: throwBadRequest("No instances found for application")
            val loggers = instanceLoggerService.getLoggers(instance.id)
            mapOf(instance to loggers)
        } else {
            runBlocking {
                applicationService.getApplicationInstances(application.id)
                    .associateWith {
                        async(Dispatchers.Default) {
                            instanceLoggerService.getLoggers(it.id)
                        }
                    }
                    .mapValues {
                        runCatching { it.value.await() }
                            .getOrNull() ?: emptyList()
                    }
            }
        }

        val applicationLoggers = mutableListOf<ApplicationLoggerRO>()
        for ((instance, loggerList) in loggers) {
            for (instanceLogger in loggerList) {
                val applicationLogger = applicationLoggers.find { it.name == instanceLogger.name }
                if (applicationLogger == null) {
                    applicationLoggers.add(
                        ApplicationLoggerRO(
                            name = instanceLogger.name,
                            loggers = mutableMapOf(instance.id to instanceLogger)
                        )
                    )
                } else {
                    applicationLogger.loggers[instance.id] = instanceLogger
                }
            }
        }
        return applicationLoggers
    }

    fun getLogger(applicationId: UUID, loggerName: String): ApplicationLoggerRO {
        val application = applicationService.getApplicationOrThrow(applicationId)
        applicationService.hasAbilityOrThrow(application, InstanceAbility.LOGGERS)
        val loggers = if (application.instanceCount > MAX_INSTANCE_COUNT) {
            val instance = applicationService.getApplicationInstances(application.id)
                .firstOrNull() ?: throwBadRequest("No instances found for application")
            val loggers = instanceLoggerService.getLogger(instance.id, loggerName)
            mapOf(instance to loggers)
        } else {
            runBlocking {
                applicationService.getApplicationInstances(application.id).associateWith {
                    async {
                        instanceLoggerService.getLogger(it.id, loggerName)
                    }
                }
                    .mapValues {
                        runCatching { it.value.await() }
                            .getOrNull()
                    }
            }
        }

        val applicationLogger = ApplicationLoggerRO(
            name = loggerName,
            loggers = mutableMapOf()
        )
        for ((instance, instanceLogger) in loggers) {
            if (instanceLogger != null) {
                applicationLogger.loggers[instance.id] = instanceLogger
            }
        }
        return applicationLogger
    }

    fun setLoggerLevel(applicationId: UUID, loggerName: String, level: LogLevel?): ApplicationLoggerRO {
        val application = applicationService.getApplicationOrThrow(applicationId)
        applicationService.hasAbilityOrThrow(application, InstanceAbility.LOGGERS)
        var failureCount = 0
        runBlocking {
            applicationService.getApplicationInstances(application.id)
                .map {
                    async(Dispatchers.Default) {
                        try {
                            instanceLoggerService.setLoggerLevel(it.id, loggerName, level)
                        } catch (e: Exception) {
                            failureCount++
                            // ignore
                        }
                    }
                }
                .awaitAll()
        }
        if (failureCount == application.instanceCount) {
            throwBadRequest("Failed to set logger level, all instances failed")
        }
        return getLogger(applicationId, loggerName)
    }

    companion object {
        private const val MAX_INSTANCE_COUNT = 10
    }
}