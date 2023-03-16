package dev.krud.boost.daemon

import dev.krud.crudframework.crud.handler.krud.EnableKrud
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableKrud
class DaemonApplication

fun main(args: Array<String>) {
    runApplication<DaemonApplication>(*args)
}