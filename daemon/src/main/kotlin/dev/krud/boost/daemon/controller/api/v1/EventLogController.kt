package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.eventlog.model.EventLog
import dev.krud.boost.daemon.eventlog.ro.EventLogRO
import dev.krud.crudframework.crud.handler.krud.Krud
import dev.krud.shapeshift.ShapeShift
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("$API_PREFIX/eventlogs")
@Tag(name = "EventLog", description = "Event Log API")
class EventLogController(
    private val shapeShift: ShapeShift,
    private val eventLogKrud: Krud<EventLog, UUID>
) : AbstractCrudController<EventLog, EventLogRO, EventLogRO, EventLogRO>(EventLog::class, EventLogRO::class, shapeShift, eventLogKrud)