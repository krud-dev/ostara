package dev.krud.boost.daemon.configuration.instance.heapdump

import dev.krud.boost.daemon.configuration.instance.InstanceActuatorClientProvider
import dev.krud.boost.daemon.configuration.instance.InstanceService
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
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.io.InputStream
import java.util.*

@Service
class InstanceHeapdumpService(
    private val instanceHeapdumpReferenceKrud: Krud<InstanceHeapdumpReference, UUID>,
    private val shapeShift: ShapeShift,
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceHeapdumpStore: InstanceHeapdumpStore
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
        return shapeShift.map(
            instanceHeapdumpReferenceKrud.create(
                InstanceHeapdumpReference(
                    instanceId
                )
            )
        )
    }

    @Scheduled(fixedDelay = 10000)
    fun downloadPendingHeapdumps() {
        val references = synchronized(mutex) {
            instanceHeapdumpReferenceKrud.updateByFilter(
                false,
                {
                    where {
                        InstanceHeapdumpReference::status Equal InstanceHeapdumpReference.Status.PENDING_DOWNLOAD
                    }
                }
            ) {
                status = InstanceHeapdumpReference.Status.DOWNLOADING
            }
        }

        for (reference in references) {
            try {
                val client = actuatorClientProvider.provide(reference.instanceId)
                val heapdumpInputStream = client.heapDump()
                    .getOrThrow()
                val (path, size) = instanceHeapdumpStore.storeHeapdump(reference.id, heapdumpInputStream)
                    .getOrThrow()
                reference.ready(
                    path = path,
                    size = size
                )
            } catch (e: Exception) {
                reference.failed(e)
            } finally {
                instanceHeapdumpReferenceKrud.update(reference)
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