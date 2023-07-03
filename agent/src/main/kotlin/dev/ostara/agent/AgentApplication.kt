package dev.ostara.agent

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class AgentApplication

fun main(args: Array<String>) {
  runApplication<AgentApplication>(*args)
}
