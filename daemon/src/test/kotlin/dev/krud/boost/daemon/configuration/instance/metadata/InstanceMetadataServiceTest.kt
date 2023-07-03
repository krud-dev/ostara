package dev.krud.boost.daemon.configuration.instance.metadata

import dev.krud.boost.daemon.actuator.model.InfoActuatorResponse
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.TestInstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceDeletedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceHealthChangedEventMessage
import dev.krud.boost.daemon.configuration.instance.messaging.InstanceUpdatedEventMessage
import dev.krud.boost.daemon.configuration.instance.metadata.messaing.InstanceMetadataRefreshRequestMessage
import dev.krud.boost.daemon.configuration.instance.metadata.messaing.InstanceMetadataRefreshedMessage
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.configuration.instance.stubInstance
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.boost.daemon.jackson.ParsedDate
import dev.krud.boost.daemon.utils.resolve
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.kotlin.any
import org.mockito.kotlin.argumentCaptor
import org.mockito.kotlin.mock
import org.mockito.kotlin.never
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.http.HttpStatus
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.web.server.ResponseStatusException
import strikt.api.expect
import strikt.api.expectThat
import strikt.api.expectThrows
import strikt.assertions.isEqualTo
import strikt.assertions.isNotNull
import strikt.assertions.isNull
import java.util.*

@ExtendWith(SpringExtension::class)
class InstanceMetadataServiceTest {
    private val instanceService: InstanceService = mock()
    private val instanceActuatorClientProvider = TestInstanceActuatorClientProvider()
    private val instanceMetadataRefreshChannel = mock<PublishSubscribeChannel>()
    private val instanceMetadataRefreshRequestChannel = mock<QueueChannel>()
    private val cacheManager = ConcurrentMapCacheManager("instanceMetadataCache")

    private val instanceMetadataService = InstanceMetadataService(
        instanceService,
        instanceActuatorClientProvider,
        instanceMetadataRefreshChannel,
        instanceMetadataRefreshRequestChannel,
        cacheManager
    )

    @Test
    fun `getCachedMetadata should return null if metadata was not found and send a request`() {
        val instanceId = UUID.randomUUID()
        val metadata = instanceMetadataService.getCachedMetadata(instanceId)
        val messageCaptor = argumentCaptor<InstanceMetadataRefreshRequestMessage>()
        verify(instanceMetadataRefreshRequestChannel).send(messageCaptor.capture())
        expect {
            that(metadata).isNull()
            that(messageCaptor.firstValue.payload.instanceId).isEqualTo(instanceId)
        }
    }

    @Test
    fun `getCachedMetadata should return metadata if exists`() {
        val instance = stubInstance()
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataCache.put(instance.id, InstanceMetadataDTO("1.0.0"))
        val metadata = instanceMetadataService.getCachedMetadata(instance.id)
        expect {
            that(metadata).isNotNull()
            that(metadata!!.version).isEqualTo("1.0.0")
            verify(instanceMetadataRefreshRequestChannel, never()).send(any())
        }
    }

    @Test
    fun `getMetadata should throw if instance was not found`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceService.getInstanceOrThrow(instanceId))
            .then {
                throwNotFound("Instance not found")
            }
        val exception = expectThrows<ResponseStatusException> {
            instanceMetadataService.getMetadata(instanceId)
        }
            .subject
        expectThat(exception.statusCode).isEqualTo(HttpStatus.NOT_FOUND)
    }

    @Test
    fun `getMetadata should return metadata and send refresh message`() {
        val instance = stubInstance()
        val client = instanceActuatorClientProvider.provide(instance)
        whenever(instanceService.getInstanceOrThrow(instance.id))
            .thenReturn(instance)
        whenever(client.info())
            .thenReturn(
                Result.success(stubInfoActuatorResponse())
            )
        val metadata = instanceMetadataService.getMetadata(instance)
        expect {
            that(metadata.version).isEqualTo("1.0.0")
        }
        val messageCaptor = argumentCaptor<InstanceMetadataRefreshedMessage>()
        verify(instanceMetadataRefreshChannel).send(messageCaptor.capture())
        expect {
            val message = messageCaptor.firstValue
            that(message.payload.instanceId).isEqualTo(instance.id)
            that(message.payload.metadata.version).isEqualTo("1.0.0")
        }
    }

    @Test
    fun `onInstanceEvent should evict on instance updated`() {
        val instance = stubInstance()
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataCache.put(instance.id, InstanceMetadataDTO())
        instanceMetadataService.onInstanceEvent(
            InstanceUpdatedEventMessage(
                InstanceUpdatedEventMessage.Payload(instance.id, instance.parentApplicationId, false)
            )
        )
        expect {
            that(instanceMetadataCache.get(instance.id)).isNull()
        }
    }

    @Test
    fun `onInstanceEvent should evict on instance deleted`() {
        val instance = stubInstance()
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataCache.put(instance.id, InstanceMetadataDTO())
        instanceMetadataService.onInstanceEvent(
            InstanceDeletedEventMessage(
                InstanceDeletedEventMessage.Payload(instance.id, instance.parentApplicationId, false)
            )
        )
        expect {
            that(instanceMetadataCache.get(instance.id)).isEqualTo(null)
        }
    }

    @Test
    fun `onInstanceEvent should evict if instance is not up`() {
        val instance = stubInstance()
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataCache.put(instance.id, InstanceMetadataDTO())
        instanceMetadataService.onInstanceEvent(
            InstanceHealthChangedEventMessage(
                InstanceHealthChangedEventMessage.Payload(
                    instance.parentApplicationId,
                    instance.id,
                    InstanceHealthRO.up(instance.id),
                    InstanceHealthRO.down(instance.id)
                )
            )
        )
        expect {
            that(instanceMetadataCache.get(instance.id)).isEqualTo(null)
        }
    }

    @Test
    fun `onInstanceEvent should refresh metadata if instance is up`() {
        val instance = stubInstance()
        val client = instanceActuatorClientProvider.provide(instance)
        whenever(instanceService.getInstanceOrThrow(instance.id))
            .thenReturn(instance)
        whenever(client.info())
            .thenReturn(
                Result.success(stubInfoActuatorResponse())
            )
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataService.onInstanceEvent(
            InstanceHealthChangedEventMessage(
                InstanceHealthChangedEventMessage.Payload(
                    instance.parentApplicationId,
                    instance.id,
                    InstanceHealthRO.down(instance.id),
                    InstanceHealthRO.up(instance.id)
                )
            )
        )
        expect {
            val metadata = instanceMetadataCache.get(instance.id, InstanceMetadataDTO::class.java)
            that(metadata!!.version).isEqualTo("1.0.0")
            that(metadata.buildTime).isEqualTo(Date(0))
            that(metadata.gitBranch).isEqualTo("master")
            that(metadata.gitCommitId).isEqualTo("abcdefg")
        }
    }

    private fun stubInfoActuatorResponse() = InfoActuatorResponse(
        build = (
                InfoActuatorResponse.Build(
                    version = "1.0.0",
                    time = ParsedDate(
                        Date(0),
                        null
                    )
                )
                ),
        git = InfoActuatorResponse.Git.Simple(
            "master",
            InfoActuatorResponse.Git.Simple.Commit(
                "abcdefg",
                ParsedDate(
                    Date(0),
                    null
                )
            )
        )
    )

    @Test
    fun `onInstanceMetadataRefreshRequest should refresh metadata`() {
        val instance = stubInstance()
        val client = instanceActuatorClientProvider.provide(instance)
        whenever(instanceService.getInstance(instance.id))
            .thenReturn(instance)
        whenever(client.info())
            .thenReturn(
                Result.success(stubInfoActuatorResponse())
            )
        val instanceMetadataCache by cacheManager.resolve()
        instanceMetadataService.onInstanceMetadataRefreshRequest(
            InstanceMetadataRefreshRequestMessage.Payload(instance.id)
        )
        val messageCaptor = argumentCaptor<InstanceMetadataRefreshedMessage>()
        verify(instanceMetadataRefreshChannel).send(messageCaptor.capture())
        expect {
            val message = messageCaptor.firstValue
            that(message.payload.instanceId).isEqualTo(instance.id)
            that(message.payload.metadata.version).isEqualTo("1.0.0")
            that(message.payload.metadata.buildTime).isEqualTo(Date(0))
            that(message.payload.metadata.gitBranch).isEqualTo("master")
            that(message.payload.metadata.gitCommitId).isEqualTo("abcdefg")
        }
    }

    @Test
    fun `onInstanceMetadataRefreshRequest should not refresh metadata if instance is not found`() {
        val instanceId = UUID.randomUUID()
        whenever(instanceService.getInstance(instanceId))
            .thenReturn(null)
        instanceMetadataService.onInstanceMetadataRefreshRequest(
            InstanceMetadataRefreshRequestMessage.Payload(instanceId)
        )
        verify(instanceMetadataRefreshChannel, never()).send(any())
    }
}