package dev.ostara.springclient

import dev.ostara.springclient.config.OstaraClientAutoConfiguration
import org.springframework.boot.autoconfigure.ImportAutoConfiguration
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
@ImportAutoConfiguration(OstaraClientAutoConfiguration::class)
class SpringClientApplication

fun main(args: Array<String>) {
  runApplication<SpringClientApplication>(*args)
}
