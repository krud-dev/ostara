package dev.krud.boost.daemon.configuration.instance.ro

import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO
import dev.krud.boost.daemon.configuration.instance.metadata.ro.InstanceMetadataDTO
import dev.krud.boost.daemon.utils.DEFAULT_COLOR
import dev.krud.boost.daemon.utils.TypeDefaults
import java.util.*

class InstanceRO(
    val id: UUID,
    var hostname: String?,
    val alias: String?,
    var actuatorUrl: String,
    val parentApplicationId: UUID,
    val description: String? = null,
    val color: String = DEFAULT_COLOR,
    val icon: String? = null,
    val sort: Double? = null,
    var health: InstanceHealthRO = InstanceHealthRO.unknown(id),
    var demo: Boolean = false,
    var metadata: InstanceMetadataDTO = InstanceMetadataDTO(),
    var parentAgentId: UUID? = null,
    var agentExternalId: String? = null,
    var discovered: Boolean = TypeDefaults.BOOLEAN
)