package dev.krud.boost.daemon

import dev.krud.crudframework.jpa.annotation.EnableJpaCrud
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableJpaCrud
@EnableCaching
@EnableScheduling
class DaemonApplication

fun main(args: Array<String>) {
    runApplication<DaemonApplication>(*args)
}