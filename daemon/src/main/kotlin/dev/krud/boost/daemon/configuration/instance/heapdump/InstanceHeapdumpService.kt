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
import dev.krud.crudframework.crud.handler.CrudHandler
import dev.krud.crudframework.crud.hooks.update.CRUDOnUpdateHook
import dev.krud.crudframework.modelfilter.dsl.where
import org.springframework.beans.factory.InitializingBean
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.io.InputStream
import java.util.*

@Service
class InstanceHeapdumpService(
    private val crudHandler: CrudHandler,
    private val instanceService: InstanceService,
    private val actuatorClientProvider: InstanceActuatorClientProvider,
    private val instanceHeapdumpStore: InstanceHeapdumpStore
) : InitializingBean {
    private val mutex = Any()

    override fun afterPropertiesSet() {
        synchronized(mutex) {
            crudHandler.updateByFilter(
                where<InstanceHeapdumpReference> {
                    InstanceHeapdumpReference::status Equal InstanceHeapdumpReference.Status.DOWNLOADING
                },
                InstanceHeapdumpReference::class.java
            )
                .withOnHook(
                    CRUDOnUpdateHook {
                        it.status = InstanceHeapdumpReference.Status.PENDING_DOWNLOAD
                    }
                )
                .execute()
        }
    }

    fun getHeapdumpReference(referenceId: UUID): InstanceHeapdumpReference? {
        return crudHandler.show(referenceId, InstanceHeapdumpReference::class.java)
            .execute()
    }

    fun getHeapdumpReferenceOrThrow(referenceId: UUID): InstanceHeapdumpReference {
        return getHeapdumpReference(referenceId) ?: throwNotFound("Heapdump $referenceId not found")
    }

    fun requestHeapdump(instanceId: UUID): InstanceHeapdumpReferenceRO {
        instanceService.getInstanceOrThrow(instanceId)
        return crudHandler.create(
            InstanceHeapdumpReference(
                instanceId
            ),
            InstanceHeapdumpReferenceRO::class.java
        ).execute()
    }

    @Scheduled(fixedDelay = 10000)
    fun downloadPendingHeapdumps() {
        val references = synchronized(mutex) {
            crudHandler.updateByFilter(
                where {
                    InstanceHeapdumpReference::status Equal InstanceHeapdumpReference.Status.PENDING_DOWNLOAD
                },
                InstanceHeapdumpReference::class.java
            )
                .withOnHook(
                    CRUDOnUpdateHook {
                        it.status = InstanceHeapdumpReference.Status.DOWNLOADING
                    }
                )
                .execute()
        }

        for (reference in references) {
            try {
                val client = actuatorClientProvider.provide(reference.instanceId)
                val heapdumpInputStream = client.heapDump()
                    .getOrThrow()
                val fileSize = heapdumpInputStream.available()
                val path = instanceHeapdumpStore.storeHeapdump(reference.id, heapdumpInputStream)
                    .getOrThrow()
                reference.ready(
                    path = path,
                    size = fileSize.toLong()
                )
            } catch (e: Exception) {
                reference.failed(e)
            } finally {
                crudHandler.update(reference, InstanceHeapdumpReferenceRO::class.java).execute()
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
}