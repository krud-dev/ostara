package dev.krud.boost.daemon.configuration.instance.ability

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import io.github.oshai.KotlinLogging
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class InstanceAbilityServiceImpl(
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceAbilityResolvers: List<InstanceAbilityResolver>,
    private val instanceService: InstanceService,
    cacheManager: CacheManager
) : InstanceAbilityService {
    private val instanceAbilityCache by cacheManager.resolve()

    @Cacheable(cacheNames = ["instanceAbilityCache"], key = "#instanceId", unless = "#result.isEmpty()")
    override fun getAbilities(instanceId: UUID): Set<InstanceAbility> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        return getAbilities(instance)
    }

    @Cacheable(cacheNames = ["instanceAbilityCache"], key = "#instance.id", unless = "#result.isEmpty()")
    override fun getAbilities(instance: Instance): Set<InstanceAbility> {
        log.debug { "Getting abilities for instance ${instance.id}" }
        val actuatorClient = actuatorClientProvider.provide(instance)
        val endpoints = actuatorClient.endpoints().getOrElse { return emptySet() }
        val options = InstanceAbilityResolver.Options(instance, endpoints, actuatorClient)
        return instanceAbilityResolvers
            .filter {
                it.hasAbility(
                    options
                )
            }
            .map { it.ability }
            .toSet()
            .apply {
                log.debug { "Instance ${instance.id} has abilities '${this.joinToString()}'" }
            }
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceCreatedEventMessage -> {
                log.debug { "Instance created: Evicting instance abilities cache for instance ${event.payload.instanceId}" }
                instanceAbilityCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                log.debug { "Instance updated: Evicting instance abilities cache for instance ${event.payload.instanceId}" }
                instanceAbilityCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                log.debug { "Instance deleted: Evicting instance abilities cache for instance ${event.payload.instanceId}" }
                instanceAbilityCache.evict(event.payload.instanceId)
            }
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}