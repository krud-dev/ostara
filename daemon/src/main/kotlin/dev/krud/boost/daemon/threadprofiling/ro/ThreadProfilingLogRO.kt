package dev.krud.boost.daemon.threadprofiling.ro

import dev.krud.boost.daemon.actuator.model.ThreadDumpActuatorResponse
import java.util.*

class ThreadProfilingLogRO(
    val id: UUID,
    val creationTime: Date,
    val requestId: UUID
) {
    lateinit var threads: List<ThreadDumpActuatorResponse.Thread>
}