package dev.krud.boost.daemon

import dev.krud.crudframework.jpa.annotation.EnableJpaCrud
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
@EnableJpaCrud
class DaemonApplication

@RestController
class TestController {
    @GetMapping("/")
    fun test() : String {
        return "Test"
    }
}

fun main(args: Array<String>) {
    runApplication<DaemonApplication>(*args)
}
