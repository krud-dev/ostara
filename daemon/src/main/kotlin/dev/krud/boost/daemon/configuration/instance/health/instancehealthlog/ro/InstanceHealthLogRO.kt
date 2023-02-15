package dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.time.LocalDateTime
import java.util.*

class InstanceHealthLogRO(
    var creationTime: LocalDateTime,
    var instanceId: UUID,
    var status: InstanceHealthStatus = InstanceHealthStatus.UNKNOWN,
    var statusText: String? = null

)