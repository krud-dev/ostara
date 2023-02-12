package dev.krud.boost.daemon

import dev.krud.crudframework.jpa.annotation.EnableJpaCrud
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableJpaCrud
class DaemonApplication

fun main(args: Array<String>) {
    runApplication<DaemonApplication>(*args)
}