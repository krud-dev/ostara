package dev.ostara.plugins

import dev.ostara.servicediscovery.serviceDiscoveryModule
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
