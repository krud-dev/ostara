package dev.krud.boost.daemon.threadprofiling.ro

import dev.krud.boost.daemon.threadprofiling.enums.ThreadProfilingStatus
import java.util.*

class ThreadProfilingRequestRO(
    var id: UUID,
    var creationTime: Date,
    var instanceId: UUID,
    var durationSec: Int,
    var finishTime: Date,
    var status: ThreadProfilingStatus
)