package dev.krud.boost.daemon.exitcode

object ExitCodes {
    const val UNKNOWN = 1

    // Flyway error codes 10-20
    const val FLYWAY_DB_CONNECTION = 10
    const val FLYWAY_DB_MIGRATION_FAILED = 11
    const val FLYWAY_FAILED_VALIDATION = 12
    const val FLYWAY_UNKNOWN = 20
}