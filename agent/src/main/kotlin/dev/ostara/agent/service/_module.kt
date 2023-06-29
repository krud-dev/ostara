package dev.ostara.agent.service

import dev.ostara.agent.servicediscovery.handler.InternalServiceDiscoveryHandlerImpl
import dev.ostara.agent.servicediscovery.handler.KubernetesServiceDiscoveryHandlerImpl
import dev.ostara.agent.servicediscovery.handler.ServiceDiscoveryHandler
import org.koin.core.module.dsl.createdAtStart
import org.koin.core.module.dsl.singleOf
import org.koin.core.module.dsl.withOptions
import org.koin.dsl.bind
import org.koin.dsl.module

val serviceModule = module {
  singleOf(::KubernetesServiceDiscoveryHandlerImpl) bind ServiceDiscoveryHandler::class
  singleOf(::InternalServiceDiscoveryHandlerImpl) bind ServiceDiscoveryHandler::class
  single { ServiceDiscoveryService(get(), getAll()) } withOptions {
    createdAtStart()
  }
}
