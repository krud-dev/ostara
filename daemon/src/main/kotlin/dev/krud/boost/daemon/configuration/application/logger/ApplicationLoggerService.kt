package dev.krud.boost.daemon.configuration.application.logger

import dev.krud.boost.daemon.configuration.application.ApplicationService
import dev.krud.boost.daemon.configuration.application.logger.ro.ApplicationLoggerRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.logger.InstanceLoggerService
import org.springframework.boot.logging.LogLevel
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationLoggerService(
    private val applicationService: ApplicationService,
    private val instanceLoggerService: InstanceLoggerService
) {
    fun getLoggers(applicationId: UUID): List<ApplicationLoggerRO> {
        val application = applicationService.getApplicationOrThrow(applicationId)
        applicationService.hasAbilityOrThrow(application, InstanceAbility.LOGGERS)
        val loggers = applicationService.getApplicationInstances(application.id).associateWith { instanceLoggerService.getLoggers(it.id) }

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
        val loggers = applicationService.getApplicationInstances(application.id).associateWith {
            try {
                instanceLoggerService.getLogger(it.id, loggerName)
            } catch (e: Exception) {
                null // Ignore for now
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
        for (instance in applicationService.getApplicationInstances(application.id)) {
            try {
                instanceLoggerService.setLoggerLevel(instance.id, loggerName, level)
            } catch (e: Exception) {
                // Ignore for now
            }
        }
        return getLogger(applicationId, loggerName)
    }
}