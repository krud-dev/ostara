package dev.krud.boost.daemon.configuration.application.logger

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.logger.ro.ApplicationLoggerRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.logger.InstanceLoggerService
import dev.krud.boost.daemon.exception.throwBadRequest
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.async
import kotlinx.coroutines.awaitAll
import kotlinx.coroutines.runBlocking
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationLoggerService(
    private val applicationService: ApplicationService,
    private val instanceLoggerService: InstanceLoggerService,
    private val dispatcher: CoroutineDispatcher
) {
    fun getLoggers(applicationId: UUID): List<ApplicationLoggerRO> {
        log.debug { "Getting loggers for application $applicationId" }
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
                        async(dispatcher) {
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
        log.debug { "Getting logger $loggerName for application $applicationId" }
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

    fun setLoggerLevel(applicationId: UUID, loggerName: String, level: String?): ApplicationLoggerRO {
        log.debug { "Setting logger $loggerName level to $level for application $applicationId" }
        val application = applicationService.getApplicationOrThrow(applicationId)
        applicationService.hasAbilityOrThrow(application, InstanceAbility.LOGGERS)
        var failureCount = 0
        runBlocking {
            applicationService.getApplicationInstances(application.id)
                .map {
                    async(dispatcher) {
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
        private val log = KotlinLogging.logger { }
    }
}