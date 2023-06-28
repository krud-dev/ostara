package dev.ostara.agent.plugins

import dev.ostara.agent.servicediscovery.serviceDiscoveryModule
import io.ktor.server.application.*
import org.koin.ktor.plugin.Koin

fun Application.configureKoin() {
  install(Koin) {
    modules(
      listOf(
        serviceDiscoveryModule,
      )
    )
  }
}
