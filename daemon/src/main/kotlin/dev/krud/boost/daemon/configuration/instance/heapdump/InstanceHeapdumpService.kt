package dev.krud.boost.daemon.configuration.instance.heapdump

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.configuration.instance.heapdump.messaging.InstanceHeapdumpDownloadProgressMessage
import dev.krud.boost.daemon.configuration.instance.heapdump.messaging.InstanceHeapdumpDownloadRequestMessage
import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference
import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference.Companion.failed
import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference.Companion.ready
import dev.krud.boost.daemon.configuration.instance.heapdump.ro.InstanceHeapdumpReferenceRO
import dev.krud.boost.daemon.configuration.instance.heapdump.store.InstanceHeapdumpStore
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.exception.throwNotFound
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import org.springframework.beans.factory.InitializingBean
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.stereotype.Service
import java.io.InputStream
import java.util.*

@Service
class InstanceHeapdumpService(
    private val instanceHeapdumpReferenceKrud: Krud<InstanceHeapdumpReference, UUID>,
    private val shapeShift: ShapeShift,
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceHeapdumpStore: InstanceHeapdumpStore,
    private val instanceHeapdumpDownloadRequestChannel: QueueChannel,
    private val instanceHeapdumpDownloadProgressInputChannel: PublishSubscribeChannel
) : InitializingBean {
    private val mutex = Any()

    override fun afterPropertiesSet() {
        synchronized(mutex) {
            instanceHeapdumpReferenceKrud
                .updateByFilter(
                    false,
                    {
                        where {
                            InstanceHeapdumpReference::status Equal InstanceHeapdumpReference.Status.DOWNLOADING
                        }
                    }
                ) {
                    status = InstanceHeapdumpReference.Status.PENDING_DOWNLOAD
                }
                .forEach {
                    instanceHeapdumpDownloadRequestChannel.send(
                        InstanceHeapdumpDownloadRequestMessage(
                            InstanceHeapdumpDownloadRequestMessage.Payload(
                                it.id,
                                it.instanceId
                            )
                        )
                    )
                }
        }
    }

    fun getHeapdumpReference(referenceId: UUID): InstanceHeapdumpReference? {
        return instanceHeapdumpReferenceKrud.showById(referenceId)
    }

    fun getHeapdumpReferenceOrThrow(referenceId: UUID): InstanceHeapdumpReference {
        return getHeapdumpReference(referenceId) ?: throwNotFound("Heapdump $referenceId not found")
    }

    fun requestHeapdump(instanceId: UUID): InstanceHeapdumpReferenceRO {
        instanceService.getInstanceOrThrow(instanceId)
        val reference = instanceHeapdumpReferenceKrud.create(
            InstanceHeapdumpReference(
                instanceId
            )
        )
        instanceHeapdumpDownloadRequestChannel.send(
            InstanceHeapdumpDownloadRequestMessage(
                InstanceHeapdumpDownloadRequestMessage.Payload(
                    reference.id,
                    instanceId
                )
            )
        )
        return shapeShift.map(
            reference,
            InstanceHeapdumpReferenceRO::class.java
        )
    }

    @ServiceActivator(inputChannel = "instanceHeapdumpDownloadRequestChannel")
    fun downloadPendingHeapdumps(payload: InstanceHeapdumpDownloadRequestMessage.Payload) {
        val (referenceId, instanceId) = payload
        val reference = instanceHeapdumpReferenceKrud.updateById(referenceId) {
            status = InstanceHeapdumpReference.Status.DOWNLOADING
        }
        try {
            val client = actuatorClientProvider.provide(instanceId)
            val heapdumpInputStream = client.heapDump { bytesRead, contentLength, done ->
                instanceHeapdumpDownloadProgressInputChannel.send(
                    InstanceHeapdumpDownloadProgressMessage(
                        InstanceHeapdumpDownloadProgressMessage.Payload(
                            referenceId,
                            instanceId,
                            bytesRead,
                            contentLength,
                            if (done) InstanceHeapdumpReference.Status.READY else InstanceHeapdumpReference.Status.DOWNLOADING
                        )
                    )
                )
            }
                .getOrThrow()
            val (path, size) = instanceHeapdumpStore.storeHeapdump(reference.id, heapdumpInputStream)
                .getOrThrow()
            reference.ready(
                path = path,
                size = size
            )
        } catch (e: Exception) {
            reference.failed(e)
            instanceHeapdumpDownloadProgressInputChannel.send(
                InstanceHeapdumpDownloadProgressMessage(
                    InstanceHeapdumpDownloadProgressMessage.Payload(
                        reference.id,
                        instanceId,
                        -1,
                        -1,
                        InstanceHeapdumpReference.Status.FAILED,
                        reference.error
                    )
                )
            )
        } finally {
            instanceHeapdumpReferenceKrud.updateById(referenceId) {
                status = reference.status
                error = reference.error
                path = reference.path
                size = reference.size
            }
        }
    }

    fun downloadHeapdump(referenceId: UUID): InputStream {
        val reference = getHeapdumpReferenceOrThrow(referenceId)
        if (reference.status != InstanceHeapdumpReference.Status.READY) {
            throwBadRequest("Heapdump $referenceId is not ready")
        }
        return instanceHeapdumpStore.getHeapdump(referenceId)
            .getOrThrow()
    }

    fun deleteHeapdump(referenceId: UUID) {
        val reference = getHeapdumpReferenceOrThrow(referenceId)
        if (reference.status == InstanceHeapdumpReference.Status.DOWNLOADING) {
            throwBadRequest("Heapdump $referenceId is downloading, please wait.")
        }
        instanceHeapdumpStore.deleteHeapdump(referenceId)
            .getOrThrow()
        instanceHeapdumpReferenceKrud.deleteById(referenceId)
    }
}