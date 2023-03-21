package dev.krud.boost.daemon.threadprofiling.crud

import dev.krud.boost.daemon.configuration.instance.InstanceService
import dev.krud.boost.daemon.exception.throwBadRequest
import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.boost.daemon.threadprofiling.ro.ThreadProfilingRequestCreateRO
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.crudframework.crud.hooks.interfaces.CreateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.CreateHooks
import dev.krud.crudframework.crud.hooks.interfaces.DeleteHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class ThreadProfilingRequestPersistentHooks(
    private val threadProfilingLogKrud: Krud<ThreadProfilingLog, UUID>,
    private val instanceService: InstanceService
) : CreateHooks<UUID, ThreadProfilingRequest>, CreateFromHooks<UUID, ThreadProfilingRequest>, DeleteHooks<UUID, ThreadProfilingRequest> {
    override fun preCreate(entity: ThreadProfilingRequest) {
        instanceService.getInstanceOrThrow(entity.instanceId)
    }

    override fun preCreateFrom(ro: Any) {
        ro as ThreadProfilingRequestCreateRO
        instanceService.getInstanceOrThrow(ro.instanceId)
    }

    override fun onCreate(entity: ThreadProfilingRequest) {
        setFinishTime(entity)
    }

    override fun onCreateFrom(entity: ThreadProfilingRequest, ro: Any) {
        setFinishTime(entity)
    }

    override fun onDelete(entity: ThreadProfilingRequest) {
        if (entity.status != ThreadProfilingStatus.FINISHED) {
            throwBadRequest("Cannot delete profiling request that is not finished")
        }
        threadProfilingLogKrud.deleteByFilter {
            where {
                ThreadProfilingLog::requestId Equal entity.id
            }
        }
    }

    private fun setFinishTime(entity: ThreadProfilingRequest) {
        entity.finishTime = Date(
            System.currentTimeMillis() + (entity.durationSec * 1000)
        )
    }
}