package dev.krud.boost.daemon.exitcode

import org.flywaydb.core.api.ErrorCode
import org.flywaydb.core.api.FlywayException

object FlywayExceptionExitCodeSupplier : ExitCodeSupplier {
    override fun supports(throwable: Throwable): Boolean {
        return throwable is FlywayException || throwable.cause is FlywayException
    }

    override fun getExitCode(throwable: Throwable): Int {
        val e = when (throwable) {
            is FlywayException -> throwable
            else -> throwable.cause as FlywayException
        }
        return when (e.errorCode) {
            ErrorCode.DB_CONNECTION -> {
                ExitCodes.FLYWAY_DB_CONNECTION
            }
            else -> {
                ExitCodes.FLYWAY_UNKNOWN
            }
        }
    }
}