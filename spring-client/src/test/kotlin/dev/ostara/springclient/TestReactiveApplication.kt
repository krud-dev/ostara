package dev.ostara.springclient

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class TestReactiveApplication

fun main(args: Array<String>) {
  runApplication<TestWebApplication>(*args)
}
