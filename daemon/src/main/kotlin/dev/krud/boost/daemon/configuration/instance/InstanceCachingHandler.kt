package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.messaging.Message
import org.springframework.stereotype.Component

@Component
class InstanceCachingHandler(
    cacheManager: CacheManager
) {
    private val instanceCache by cacheManager.resolve()

    @ServiceActivator(inputChannel = "systemEventsChannel")
    fun onInstanceEvent(message: Message<*>) {
        when (message) {
            is InstanceCreatedEventMessage -> {
                instanceCache.evict(message.payload.instanceId)
            }
            is InstanceUpdatedEventMessage -> {
                instanceCache.evict(message.payload.instanceId)
            }
            is InstanceHealthChangedEventMessage -> {
                instanceCache.evict(message.payload.instanceId)
            }
            is InstanceMovedEventMessage -> {
                instanceCache.evict(message.payload.instanceId)
            }
        }
    }
}