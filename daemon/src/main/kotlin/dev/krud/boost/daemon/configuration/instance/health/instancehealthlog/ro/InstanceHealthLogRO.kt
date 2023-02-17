package dev.krud.boost.daemon.configuration.instance.health.instancehealthlog.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.util.*

class InstanceHealthLogRO(
    var creationTime: Date,
    var instanceId: UUID,
    var status: InstanceHealthStatus = InstanceHealthStatus.UNKNOWN,
    var statusText: String? = null

)