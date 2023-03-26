package dev.krud.boost.daemon.configuration.instance.health.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.util.*

data class InstanceHealthRO(
    val status: InstanceHealthStatus,
    val statusText: String?,
    val lastUpdateTime: Date,
    val lastStatusChangeTime: Date,
    val statusCode: Int? = null
) {
    companion object {
        val UNKNOWN = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            null,
            Date(),
            Date()
        )

        fun up(statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.UP,
            null,
            Date(),
            Date(),
            statusCode
        )

        fun down(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.DOWN,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun outOfService(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.OUT_OF_SERVICE,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun unreachable(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNREACHABLE,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun pending(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.PENDING,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun invalid(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.INVALID,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun unknown(statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            InstanceHealthStatus.UNKNOWN,
            statusText,
            Date(),
            Date(),
            statusCode
        )
    }
}