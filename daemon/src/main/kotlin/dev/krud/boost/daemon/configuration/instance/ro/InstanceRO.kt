package dev.krud.boost.daemon.configuration.instance.ro

import java.util.*

class InstanceRO(
    val id: UUID,
    val alias: String,
    val dataCollectionIntervalSeconds: Int,
    val description: String? = null,
    val color: String? = null,
    val icon: String? = null,
    val sort: Int? = null,
    val parentApplicationId: UUID? = null
)

