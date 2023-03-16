package dev.krud.boost.daemon.configuration.instance.data

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.ability.InstanceAbilityService
import dev.krud.boost.daemon.configuration.instance.data.ro.InstanceDisplayNameRO
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import dev.krud.boost.daemon.configuration.instance.hostname.InstanceHostnameResolver
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.exception.throwInternalServerError
import dev.krud.boost.daemon.utils.resolve
import dev.krud.boost.daemon.utils.stripEverythingAfterLastSlash
import dev.krud.boost.daemon.utils.stripHttpProtocolIfPresent
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
    private val applicationActiveProfilesCache by cacheManager.resolve()
    private val instanceDisplayNameCache by cacheManager.resolve()

    @Cacheable(cacheNames = ["applicationActiveProfilesCache"], key = "#instanceId")
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

    @Cacheable(cacheNames = ["instanceDisplayNameCache"], key = "#instanceId")
    fun getDisplayName(instanceId: UUID): InstanceDisplayNameRO {
        val instance = instanceService.getInstanceOrThrow(instanceId)
        if (!instance.alias.isNullOrBlank()) {
            return InstanceDisplayNameRO(instance.alias!!)
        }

        val displayName = instanceHostnameResolver.resolveHostname(instanceId)
            ?: instance.actuatorUrl
                .stripHttpProtocolIfPresent()
                .stripEverythingAfterLastSlash()

        return InstanceDisplayNameRO(displayName)
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    protected fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceHealthChangedEventMessage -> {
                applicationActiveProfilesCache.evict(event.payload.instanceId)
                instanceDisplayNameCache.evict(event.payload.instanceId)
            }

            is InstanceUpdatedEventMessage -> {
                applicationActiveProfilesCache.evict(event.payload.instanceId)
                instanceDisplayNameCache.evict(event.payload.instanceId)
            }

            is InstanceDeletedEventMessage -> {
                applicationActiveProfilesCache.evict(event.payload.instanceId)
                instanceDisplayNameCache.evict(event.payload.instanceId)
            }
        }
    }
}