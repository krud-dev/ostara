package dev.ostara.agent.servicediscovery

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dev.ostara.agent.servicediscovery.handler.KubernetesServiceDiscoveryHandlerImpl
import dev.ostara.agent.servicediscovery.handler.ServiceDiscoveryHandler
import org.koin.dsl.bind
import org.koin.dsl.module

val serviceDiscoveryModule = module {
  single {
    KubernetesServiceDiscoveryHandlerImpl()
  } bind ServiceDiscoveryHandler::class
  single { jacksonObjectMapper() }
}
