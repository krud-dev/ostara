package dev.krud.boost.daemon.configuration.instance.messaging

import dev.krud.boost.daemon.base.annotations.GenerateTypescript
import dev.krud.boost.daemon.base.messaging.AbstractMessage
import dev.krud.boost.daemon.configuration.instance.enums.InstanceAbility
import java.util.*

class InstanceAbilitiesRefreshedEventMessage(payload: Payload) : AbstractMessage<InstanceAbilitiesRefreshedEventMessage.Payload>(payload) {
    @GenerateTypescript
    data class Payload(
        val parentApplicationId: UUID,
        val instanceId: UUID,
        val abilities: Set<InstanceAbility>
    )
}