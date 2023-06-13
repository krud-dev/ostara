package dev.krud.boost.daemon

import dev.krud.boost.daemon.exitcode.ExitCodeSupplier
import io.github.oshai.kotlinlogging.KotlinLogging
import io.sentry.Sentry
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import kotlin.system.exitProcess

@SpringBootApplication
class DaemonApplication

val log = KotlinLogging.logger {}
val x = KotlinLogging

fun main(args: Array<String>) {
    try {
        runApplication<DaemonApplication>(*args)
    } catch (e: Exception) {
        val exitCode = ExitCodeSupplier.supply(e)
        log.error(e) { "Exiting with exit code $exitCode" }
        if (Sentry.isEnabled()) {
            Sentry.captureException(e)
        }
        exitProcess(exitCode)
    }
}