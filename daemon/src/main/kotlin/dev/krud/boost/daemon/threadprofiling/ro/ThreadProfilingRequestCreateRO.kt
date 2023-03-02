package dev.krud.boost.daemon.threadprofiling.ro

import dev.krud.boost.daemon.threadprofiling.model.ThreadProfilingRequest
import dev.krud.shapeshift.resolver.annotation.DefaultMappingTarget
import dev.krud.shapeshift.resolver.annotation.MappedField
import java.util.*

@DefaultMappingTarget(ThreadProfilingRequest::class)
class ThreadProfilingRequestCreateRO(
    @MappedField
    var instanceId: UUID,
    @MappedField
    var className: String,
    @MappedField
    var durationSec: Int
)