package dev.krud.boost.daemon.configuration.instance.data

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.hostname.InstanceHostnameResolver
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceDataService(
    private val instanceService: InstanceService,
    private val instanceAbilityService: InstanceAbilityService,
    private val instanceActuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceHostnameResolver: InstanceHostnameResolver,
    cacheManager: CacheManager
) {
    private val instanceActiveProfilesCache by cacheManager.resolve()

    @Cacheable(cacheNames = ["instanceActiveProfilesCache"], key = "#instanceId")
    fun getActiveProfiles(instanceId: UUID): Set<String> {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        instanceAbilityService.hasAbilityOrThrow(instance, InstanceAbility.ENV)
        val client = instanceActuatorClientProvider.provide(instance)
        val activeProfiles = client.env()
            .fold(
                { it.activeProfiles },
                { throwInternalServerError("Failed to fetch active profiles: ${it.message}") }
            )
        return activeProfiles
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                instanceActiveProfilesCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                instanceActiveProfilesCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                instanceActiveProfilesCache.evict(event.payload.instanceId)
            }
        }
    }
}