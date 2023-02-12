package dev.krud.boost.daemon.configuration.instance.crud

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceCreatedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.crudframework.crud.hooks.interfaces.CreateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.CreateHooks
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateHooks
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Component
import java.util.*

@Component
class InstanceEventPersistentHooks(
    private val systemEventsChannel: PublishSubscribeChannel
) : CreateHooks<UUID, Instance>, CreateFromHooks<UUID, Instance>, UpdateHooks<UUID, Instance>, UpdateFromHooks<UUID, Instance>, DeleteHooks<UUID, Instance> {
    override fun postCreate(entity: Instance) {
        systemEventsChannel.send(InstanceCreatedEventMessage(InstanceCreatedEventMessage.Payload(entity.id)))
    }

    override fun postCreateFrom(entity: Instance) {
        systemEventsChannel.send(InstanceCreatedEventMessage(InstanceCreatedEventMessage.Payload(entity.id)))
    }

    override fun postUpdate(entity: Instance) {
        systemEventsChannel.send(InstanceUpdatedEventMessage(InstanceUpdatedEventMessage.Payload(entity.id)))
    }

    override fun postUpdateFrom(entity: Instance) {
        systemEventsChannel.send(InstanceUpdatedEventMessage(InstanceUpdatedEventMessage.Payload(entity.id)))
    }

    override fun postDelete(entity: Instance) {
        systemEventsChannel.send(InstanceDeletedEventMessage(InstanceDeletedEventMessage.Payload(entity.id)))
    }
}