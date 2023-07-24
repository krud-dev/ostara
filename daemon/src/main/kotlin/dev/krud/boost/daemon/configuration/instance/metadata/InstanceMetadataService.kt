package dev.krud.boost.daemon.configuration.instance.metadata

import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.messaging.InstanceMetadataRefreshRequestMessage
import dev.krud.boost.daemon.messaging.InstanceMetadataRefreshedMessage
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.utils.resolve
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.Cacheable
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.messaging.Message
import org.springframework.stereotype.Service
import java.util.*

@Service
class InstanceMetadataService(
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceMetadataRefreshChannel: PublishSubscribeChannel,
    private val instanceMetadataRefreshRequestChannel: QueueChannel,
    private val cacheManager: CacheManager
) {
    private val instanceMetadataCache by cacheManager.resolve()

    fun getCachedMetadata(instanceId: UUID): InstanceMetadataDTO? {
        val result = instanceMetadataCache.get(instanceId, InstanceMetadataDTO::class.java)
        if (result == null) {
            instanceMetadataRefreshRequestChannel.send(
                InstanceMetadataRefreshRequestMessage(
                    InstanceMetadataRefreshRequestMessage.Payload(
                        instanceId
                    )
                )
            )
        }
        return result
    }

    @ServiceActivator(inputChannel = "instanceMetadataRefreshRequestChannel")
    fun onInstanceMetadataRefreshRequest(payload: InstanceMetadataRefreshRequestMessage.Payload) {
        val instance = instanceService.getInstance(
            payload.instanceId
        ) ?: return
        getMetadata(instance)
    }

    @Cacheable("instanceMetadataCache", key = "#instanceId")
    fun getMetadata(instanceId: UUID): InstanceMetadataDTO {
        return getMetadata(instanceService.getInstanceOrThrow(instanceId))
    }

    @Cacheable("instanceMetadataCache", key = "#instance.id")
    fun getMetadata(instance: Instance): InstanceMetadataDTO {
        val client = actuatorClientProvider.provide(instance)
        val info = client.info().getOrNull()
        val dto = InstanceMetadataDTO(
            version = info?.build?.version,
            buildTime = info?.build?.time?.date,
            gitCommitId = when(info?.git) {
                is InfoActuatorResponse.Git.Full -> info.git.commit.id.abbrev
                is InfoActuatorResponse.Git.Simple -> info.git.commit.id
                else -> null
            },
            gitBranch = when(info?.git) {
                is InfoActuatorResponse.Git.Full -> info.git.branch
                is InfoActuatorResponse.Git.Simple -> info.git.branch
                else -> null
            }
        )
        instanceMetadataRefreshChannel.send(
            InstanceMetadataRefreshedMessage(
                InstanceMetadataRefreshedMessage.Payload(
                    instance.id,
                    dto
                )
            )
        )

        return dto
    }

    @ServiceActivator(inputChannel = "systemEventsChannel")
    internal fun onInstanceEvent(event: Message<*>) {
        when (event) {
            is InstanceUpdatedEventMessage -> {
                instanceMetadataCache.evict(event.payload.instanceId)
            }

            is InstanceHealthChangedEventMessage -> {
                val payload = event.payload
                if (payload.newHealth.status != InstanceHealthStatus.UP) {
                    instanceMetadataCache.evict(payload.instanceId)
                    return
                }
                val shouldRefreshMetadata = payload.oldHealth.status != InstanceHealthStatus.UP &&
                    payload.newHealth.status == InstanceHealthStatus.UP
                if (shouldRefreshMetadata) {
                    val metadata = getMetadata(payload.instanceId)
                    instanceMetadataCache.put(payload.instanceId, metadata)
                }
            }

            is InstanceDeletedEventMessage -> {
                instanceMetadataCache.evict(event.payload.instanceId)
            }
        }
    }
}