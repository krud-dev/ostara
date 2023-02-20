package dev.krud.boost.daemon.configuration.instance.heapdump.ro

import dev.krud.boost.daemon.configuration.instance.heapdump.model.InstanceHeapdumpReference
import java.util.*

class InstanceHeapdumpReferenceRO(
    var id: UUID,
    var instanceId: UUID,
    var creationTime: Date,
    var status: InstanceHeapdumpReference.Status = InstanceHeapdumpReference.Status.PENDING_DOWNLOAD,
    var path: String? = null,
    var size: Long? = null,
    var error: String? = null
)