package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.KotlinLogging
import org.springframework.cache.annotation.CachePut
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceService(
    private val instanceKrud: Krud<Instance, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel
) {
    fun getAllInstances(): Iterable<Instance> {
        log.debug { "Getting all instances from database" }
        return instanceKrud.searchByFilter { }
    }

    @CachePut("instanceCache")
    fun getInstance(instanceId: UUID): Instance? {
        log.debug { "Getting instance $instanceId from database" }
        return instanceKrud
            .showById(instanceId)
    }

    @CachePut("instanceCache")
    fun getInstanceOrThrow(instanceId: UUID): Instance {
        return getInstance(instanceId) ?: throwNotFound("Instance $instanceId not found")
    }

    /**
     * Attempt to get an instance from the cache. If it's not in the cache, attempt to get it from the database
     */
    @Cacheable("instanceCache")
    fun getInstanceFromCache(instanceId: UUID): Instance? {
        return getInstance(instanceId)
    }

    /**
     * Attempt to get an instance from the cache. If it's not in the cache, attempt to get it from the database, otherwise throw
     */
    @Cacheable("instanceCache")
    fun getInstanceFromCacheOrThrow(instanceId: UUID): Instance {
        return getInstanceFromCache(instanceId)
            ?: throwNotFound("Instance $instanceId not found")
    }

    @CachePut("instanceCache")
    fun moveInstance(instanceId: UUID, newParentApplicationId: UUID, newSort: Double?): Instance {
        log.debug { "Moving instance $instanceId to application $newParentApplicationId with sort $newSort" }
        val instance = getInstanceOrThrow(instanceId)
        val oldParentApplicationId = instance.parentApplicationId
        if (oldParentApplicationId == newParentApplicationId && instance.sort == newSort) {
            log.debug { "Instance $instanceId is already in application $newParentApplicationId with sort $newSort, skipping update" }
            return instance
        }

        instance.parentApplicationId = newParentApplicationId
        instance.sort = newSort
        val updatedInstance = instanceKrud.update(instance)
        systemEventsChannel.send(InstanceMovedEventMessage(InstanceMovedEventMessage.Payload(instanceId, oldParentApplicationId, newParentApplicationId, newSort)))
        return updatedInstance
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}