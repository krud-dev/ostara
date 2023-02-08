package dev.krud.boost.daemon.configuration.instance.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import java.util.*

class InstanceRO(
  val id: UUID,
  val alias: String,
  var actuatorUrl: String,
  val dataCollectionIntervalSeconds: Int,
  val description: String? = null,
  val color: String? = null,
  var effectiveColor: String? = null,
  val icon: String? = null,
  val sort: Int? = null,
  val parentApplicationId: UUID? = null,
  var endpoints: Set<String> = emptySet(),
  var abilities: Set<InstanceAbility> = emptySet()
)
