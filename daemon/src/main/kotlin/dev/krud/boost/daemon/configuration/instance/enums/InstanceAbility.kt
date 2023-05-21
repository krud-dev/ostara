package dev.krud.boost.daemon.configuration.instance.enums

import dev.krud.boost.daemon.base.annotations.GenerateTypescript

@GenerateTypescript
enum class InstanceAbility {
    METRICS,
    ENV,
    BEANS,
    QUARTZ,
    FLYWAY,
    LIQUIBASE,
    LOGGERS,
    CACHES,
    THREADDUMP,
    HEAPDUMP,
    CACHE_STATISTICS,
    SHUTDOWN,
    REFRESH,
    HTTP_REQUEST_STATISTICS,
    INTEGRATIONGRAPH,
    PROPERTIES,
    MAPPINGS,
    SCHEDULEDTASKS,
    HEALTH,
    INFO,
    SYSTEM_PROPERTIES,
    SYSTEM_ENVIRONMENT,
    TOGGLZ
    ;

    companion object {
        val VALUES = values().toSet()

        fun except(vararg abilities: InstanceAbility): Set<InstanceAbility> {
            return VALUES - abilities.toSet()
        }
    }
}