package dev.krud.boost.daemon.configuration.application.crud

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationAuthenticationChangedMessage
import dev.krud.boost.daemon.configuration.application.messaging.ApplicationDisableSslVerificationChangedMessage
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import dev.krud.crudframework.crud.hooks.interfaces.UpdateHooks
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Component
import java.util.*

@Component
class ApplicationPersistentHooks(
    private val instanceKrud: Krud<Instance, UUID>,
    private val systemEventsChannel: PublishSubscribeChannel,
) : DeleteHooks<UUID, Application>, UpdateHooks<UUID, Application> {
    override fun postUpdate(entity: Application) {
        val copy = entity.saveOrGetCopy() as Application
        if (copy.authentication != entity.authentication) {
            systemEventsChannel.send(
                ApplicationAuthenticationChangedMessage(
                    ApplicationAuthenticationChangedMessage.Payload(entity.id)
                )
            )
        }
        if (copy.disableSslVerification != entity.disableSslVerification) {
            systemEventsChannel.send(
                ApplicationDisableSslVerificationChangedMessage(
                    ApplicationDisableSslVerificationChangedMessage.Payload(
                        entity.id,
                        copy.disableSslVerification,
                        entity.disableSslVerification
                    )
                )
            )
        }
    }

    override fun onDelete(entity: Application) {
        instanceKrud.deleteByFilter {
            where {
                Instance::parentApplicationId Equal entity.id
            }
        }
    }
}