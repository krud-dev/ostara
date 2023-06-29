package dev.ostara.agent.plugins

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.ostara.agent.configuration.OstaraConfiguration
import dev.ostara.agent.service.serviceModule
import io.ktor.server.application.*
import org.koin.dsl.module
import org.koin.ktor.plugin.Koin

fun Application.configureKoin() {
  install(Koin) {
    modules(
      listOf(
        module {
          single { OstaraConfiguration.load("/Users/idane/projects/krud/spring-boost/agent/src/main/resources/kubernetes-config.yml") }
          single { jacksonObjectMapper() }
        },
        serviceModule
      )
    )
  }
}
