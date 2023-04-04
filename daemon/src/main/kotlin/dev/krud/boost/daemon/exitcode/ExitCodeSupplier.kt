package dev.krud.boost.daemon.exitcode

sealed interface ExitCodeSupplier {
    fun supports(throwable: Throwable): Boolean
    fun getExitCode(throwable: Throwable): Int

    companion object {
        fun supply(throwable: Throwable): Int {
            return exitCodeSuppliers
                .filter { it.supports(throwable) }
                .map { it.getExitCode(throwable) }
                .firstOrNull() ?: ExitCodes.UNKNOWN
        }
        val exitCodeSuppliers = listOf(
            FlywayExceptionExitCodeSupplier
        )
    }
}