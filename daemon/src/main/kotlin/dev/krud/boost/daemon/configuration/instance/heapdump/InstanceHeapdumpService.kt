package dev.krud.boost.daemon.configuration.instance.heapdump

import dev.krud.boost.daemon.actuator.ActuatorHttpClient
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
import dev.krud.boost.daemon.okhttp.ProgressListener
import dev.krud.boost.daemon.utils.emptyResult
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.github.oshai.KotlinLogging
import org.springframework.beans.factory.InitializingBean
import org.springframework.integration.annotation.ServiceActivator
import org.springframework.integration.channel.PublishSubscribeChannel
import org.springframework.integration.channel.QueueChannel
import org.springframework.stereotype.Service
import java.io.IOException
import java.io.InputStream
import java.util.*
import java.util.concurrent.ConcurrentHashMap

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
    private val ongoingDownloads = ConcurrentHashMap<UUID, ActuatorHttpClient.HeapdumpResponse>()

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
        log.debug {
            "Getting heapdump reference $referenceId"
        }
        return instanceHeapdumpReferenceKrud.showById(referenceId)
    }

    fun getHeapdumpReferenceOrThrow(referenceId: UUID): InstanceHeapdumpReference {
        return getHeapdumpReference(referenceId) ?: throwNotFound("Heapdump $referenceId not found")
    }

    fun requestHeapdump(instanceId: UUID): InstanceHeapdumpReferenceRO {
        log.debug {
            "Requesting heapdump for instance $instanceId"
        }
        instanceService.getInstanceOrThrow(instanceId)
        val reference = instanceHeapdumpReferenceKrud.create(
            InstanceHeapdumpReference(
                instanceId
            )
        )
        log.debug {
            "Created heapdump reference $reference"
        }
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
    fun downloadPendingHeapdump(payload: InstanceHeapdumpDownloadRequestMessage.Payload) {
        log.debug { "Downloading heapdump for instance ${payload.instanceId}" }
        val (referenceId, instanceId) = payload
        val reference = instanceHeapdumpReferenceKrud.updateById(referenceId) {
            status = InstanceHeapdumpReference.Status.DOWNLOADING
        }
        try {
            val instance = instanceService.getInstanceOrThrow(instanceId)
            val client = actuatorClientProvider.provide(instance)
            val downloadProgressListener: ProgressListener = { bytesRead, contentLength, done ->
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

            val onDownloadCompleted: (InputStream) -> Unit = { inputStream ->

                val (path, size) = instanceHeapdumpStore.storeHeapdump(reference.id, inputStream)
                    .getOrThrow()
                reference.ready(
                    path = path,
                    size = size)
                reference.update()
                ongoingDownloads.remove(referenceId)
            }

            val onDownloadFailed: (IOException) -> Unit = { error ->
                reference.failed(error)
                reference.update()
                ongoingDownloads.remove(referenceId)
            }

            val onDownloadCancelled: () -> Unit = {
                ongoingDownloads.remove(referenceId)
            }
            val response = client.heapDump(downloadProgressListener, onDownloadCompleted, onDownloadFailed, onDownloadCancelled)
                .getOrThrow()
            ongoingDownloads.putIfAbsent(referenceId, response)
        } catch (e: Exception) {
            log.error(e) { "Failed to download heapdump for instance $instanceId" }
            reference.failed(e)
            reference.update()
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
        }
    }

    fun cancelHeapdumpDownload(referenceId: UUID) {
        log.debug { "Cancelling heapdump download for reference $referenceId" }
        val response = ongoingDownloads[referenceId]
        response?.cancelDownload?.invoke()
        ongoingDownloads.remove(referenceId)
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
        log.debug { "Deleting heapdump $referenceId" }
        val reference = getHeapdumpReferenceOrThrow(referenceId)
        val result = when (reference.status) {
            InstanceHeapdumpReference.Status.PENDING_DOWNLOAD -> emptyResult()
            InstanceHeapdumpReference.Status.DOWNLOADING -> {
                cancelHeapdumpDownload(referenceId)
                emptyResult()
            }
            InstanceHeapdumpReference.Status.READY -> {
                instanceHeapdumpStore.deleteHeapdump(referenceId)
            }
            InstanceHeapdumpReference.Status.FAILED -> emptyResult()
        }
        result.getOrThrow()
        instanceHeapdumpReferenceKrud.deleteById(referenceId)
    }

    private fun InstanceHeapdumpReference.update() {
        instanceHeapdumpReferenceKrud.updateById(this.id) {
            this.status = this@update.status
            this.error = this@update.error
            this.path = this@update.path
            this.size = this@update.size
        }
    }

    companion object {
        private val log = KotlinLogging.logger { }
    }
}