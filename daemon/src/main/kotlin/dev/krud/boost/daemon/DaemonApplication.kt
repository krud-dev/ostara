package dev.krud.boost.daemon

import dev.krud.crudframework.jpa.annotation.EnableJpaCrud
import io.swagger.v3.oas.annotations.Hidden
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
@EnableJpaCrud
class DaemonApplication

@RestController
@Hidden
class TestController {
  @GetMapping("/")
  fun root(): String {
    return "OK"
  }
}

fun main(args: Array<String>) {
  runApplication<DaemonApplication>(*args)
}
