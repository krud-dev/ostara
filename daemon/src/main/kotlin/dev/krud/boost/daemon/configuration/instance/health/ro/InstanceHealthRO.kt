package dev.krud.boost.daemon.configuration.instance.health.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.time.LocalDateTime

data class InstanceHealthRO(
    val status: InstanceHealthStatus,
    val statusText: String?,
    val lastUpdateTime: LocalDateTime,
    val lastStatusChangeTime: LocalDateTime
) {
    companion object {
        val UNKNOWN = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun up() = InstanceHealthRO(
            InstanceHealthStatus.UP,
            null,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun down(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.DOWN,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun outOfService(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.OUT_OF_SERVICE,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun unreachable(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNREACHABLE,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun pending(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.PENDING,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun invalid(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.INVALID,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun unknown(statusText: String? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            statusText,
            LocalDateTime.now(),
            LocalDateTime.now()
        )
    }
}