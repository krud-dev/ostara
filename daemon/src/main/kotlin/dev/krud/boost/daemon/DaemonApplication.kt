package dev.krud.boost.daemon

import dev.krud.boost.daemon.exitcode.ExitCodeSupplier
import dev.krud.boost.daemon.exitcode.ExitCodes
import io.github.oshai.KotlinLogging
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import kotlin.system.exitProcess

@SpringBootApplication
class DaemonApplication

val log = KotlinLogging.logger {}

fun main(args: Array<String>) {
    try {
        runApplication<DaemonApplication>(*args)
    } catch (e: Exception) {
        val exitCode = ExitCodeSupplier.supply(e)
        log.error(e) { "Exiting with exit code $exitCode" }
        exitProcess(exitCode)
    }
}
