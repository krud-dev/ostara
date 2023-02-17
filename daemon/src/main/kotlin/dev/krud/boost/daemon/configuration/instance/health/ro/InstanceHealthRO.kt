package dev.krud.boost.daemon.configuration.instance.health.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.util.*

data class InstanceHealthRO(
    val status: InstanceHealthStatus,
    val statusText: String?,
    val lastUpdateTime: Date,
    val lastStatusChangeTime: Date
) {
    companion object {
        val UNKNOWN = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            null,
            Date(),
            Date()
        )

        fun up() = InstanceHealthRO(
            InstanceHealthStatus.UP,
            null,
            Date(),
            Date()
        )

        fun down(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.DOWN,
            statusText,
            Date(),
            Date()
        )

        fun outOfService(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.OUT_OF_SERVICE,
            statusText,
            Date(),
            Date()
        )

        fun unreachable(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNREACHABLE,
            statusText,
            Date(),
            Date()
        )

        fun pending(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.PENDING,
            statusText,
            Date(),
            Date()
        )

        fun invalid(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.INVALID,
            statusText,
            Date(),
            Date()
        )

        fun unknown(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            statusText,
            Date(),
            Date()
        )
    }
}