package dev.krud.ostara.inappdemo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class InAppDemoApplication

fun main(args: Array<String>) {
  runApplication<InAppDemoApplication>(*args)
}
