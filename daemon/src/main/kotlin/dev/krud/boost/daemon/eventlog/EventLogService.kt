package dev.krud.boost.daemon.eventlog

import dev.krud.boost.daemon.eventlog.enums.EventLogSeverity
import dev.krud.boost.daemon.eventlog.enums.EventLogType
import dev.krud.boost.daemon.eventlog.model.EventLog
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.stereotype.Service
import java.util.*

@Service
class EventLogService(
    private val crudHandler: CrudHandler
) {
    fun logEvent(eventType: EventLogType, targetId: UUID, message: String? = null, severity: EventLogSeverity = EventLogSeverity.INFO) {
        val eventLog = EventLog(eventType, targetId, message, severity)
        crudHandler.create(eventLog).execute()
    }
}