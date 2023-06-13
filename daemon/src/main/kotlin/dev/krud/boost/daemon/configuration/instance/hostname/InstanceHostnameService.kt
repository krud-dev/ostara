package dev.krud.boost.daemon.configuration.instance.hostname

import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.hostname.model.InstanceHostname
import dev.krud.boost.daemon.configuration.instance.hostname.resolver.InstanceHostnameResolver
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHostnameUpdatedEventMessage
import dev.krud.crudframework.crud.handler.krud.Krud
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceHostnameService(
    private val instanceService: InstanceService,
    private val instanceHostnameKrud: Krud<InstanceHostname, UUID>,
    private val instanceHostnameResolver: InstanceHostnameResolver,
    private val instanceHostnameUpdatedChannel: PublishSubscribeChannel
) {
    fun resolveAndUpdateHostname(instanceId: UUID) {
        log.debug { "Resolve hostname for instance $instanceId" }

        val instance = instanceService.getInstanceFromCacheOrThrow(instanceId)
        val hostname = instanceHostnameResolver.resolveHostname(instance)
        log.debug { "Hostname for instance $instanceId resolved to $hostname" }

        var fireEvent = false
        instanceHostnameKrud.updateByFilter(
            false,
            {
                where {
                    InstanceHostname::instance Sub {
                        Instance::id Equal instanceId
                    }
                }
            },
            {
                if (hostname != this.hostname) {
                    this.hostname = hostname
                    fireEvent = true
                }
            }
        )

        if (fireEvent) {
            instanceHostnameUpdatedChannel.send(InstanceHostnameUpdatedEventMessage(InstanceHostnameUpdatedEventMessage.Payload(instanceId, hostname)))
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}