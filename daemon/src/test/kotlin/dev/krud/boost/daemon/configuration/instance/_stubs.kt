package dev.krud.boost.daemon.configuration.instance

import dev.krud.boost.daemon.configuration.instance.entity.Instance
import java.util.*

fun stubInstance(id: UUID = UUID.randomUUID(), alias: String = "stubInstance", actuatorUrl: String = "http://example.com/actuator", parentApplicationId: UUID = UUID.randomUUID()): Instance {
    return Instance(
        alias,
        actuatorUrl,
        parentApplicationId
    ).apply {
        this.id = id
    }
}