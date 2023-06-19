package dev.ostara.servicediscovery

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.ostara.servicediscovery.handler.KubernetesServiceDiscoveryHandlerImpl
import dev.ostara.servicediscovery.handler.ServiceDiscoveryHandler
import org.koin.dsl.bind
import org.koin.dsl.module

val serviceDiscoveryModule = module {
  single {
    KubernetesServiceDiscoveryHandlerImpl()
  } bind ServiceDiscoveryHandler::class
  single { jacksonObjectMapper() }
}
