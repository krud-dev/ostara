package dev.krud.boost.daemon.eventlog.ro

import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import java.util.*

class EventLogRO(
    val id: UUID,
    var creationTime: Date,
    val type: EventLogType,
    val severity: EventLogSeverity,
    val targetId: UUID,
    val message: String? = null
)