package dev.krud.boost.daemon.threadprofiling

import dev.krud.boost.daemon.actuator.model.ThreadDumpActuatorResponse
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingLog
import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import org.springframework.data.jpa.domain.AbstractPersistable_.id
import java.util.*
import kotlin.concurrent.thread

fun stubThreadProfilingRequest(id: UUID = UUID.randomUUID(), instanceId: UUID = UUID.randomUUID(), durationSec: Int = 60): ThreadProfilingRequest {
    return ThreadProfilingRequest(
        instanceId,
        durationSec
    ).apply {
        this.id = id
    }
}

fun stubThreadProfilingLog(id: UUID = UUID.randomUUID(), requestId: UUID = UUID.randomUUID(), threads: List<ThreadDumpActuatorResponse.Thread> = emptyList()): ThreadProfilingLog {
    return ThreadProfilingLog(
        requestId,
        threads
    ).apply {
        this.id = id
    }
}