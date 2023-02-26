package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceMovedEventMessage
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceService(
    private val crudHandler: CrudHandler,
    private val systemEventsChannel: PublishSubscribeChannel
) {

    fun getAllInstances(): List<Instance> {
        return crudHandler
            .index(null, Instance::class.java)
            .execute()
            .results
    }

    fun getInstance(instanceId: UUID): Instance? {
        return crudHandler
            .show(instanceId, Instance::class.java)
            .execute()
    }

    fun getInstanceOrThrow(instanceId: UUID): Instance {
        return getInstance(instanceId) ?: throwNotFound("Instance $instanceId not found")
    }

    fun moveInstance(instanceId: UUID, newParentApplicationId: UUID, newSort: Double?): Instance {
        val instance = getInstanceOrThrow(instanceId)
        val oldParentApplicationId = instance.parentApplicationId
        instance.parentApplicationId = newParentApplicationId
        instance.sort = newSort
        val updatedInstance = crudHandler
            .update(instance)
            .execute()
        systemEventsChannel.send(InstanceMovedEventMessage(InstanceMovedEventMessage.Payload(instanceId, oldParentApplicationId, newParentApplicationId)))
        return updatedInstance
    }
}