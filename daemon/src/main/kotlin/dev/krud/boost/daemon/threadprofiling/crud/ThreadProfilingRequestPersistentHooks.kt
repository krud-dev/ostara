package dev.krud.boost.daemon.threadprofiling.crud

import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.crudframework.crud.hooks.interfaces.CreateFromHooks
import dev.krud.crudframework.crud.hooks.interfaces.CreateHooks
import org.springframework.stereotype.Component
import java.util.*

@Component
class ThreadProfilingRequestPersistentHooks : CreateHooks<UUID, ThreadProfilingRequest>, CreateFromHooks<UUID, ThreadProfilingRequest> {
    override fun onCreate(entity: ThreadProfilingRequest) {
        setFinishTime(entity)
    }

    override fun onCreateFrom(entity: ThreadProfilingRequest, ro: Any) {
        setFinishTime(entity)
    }

    private fun setFinishTime(entity: ThreadProfilingRequest) {
        entity.finishTime = Date(
            System.currentTimeMillis() + (entity.durationSec * 1000)
        )
    }
}