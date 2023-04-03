package dev.krud.boost.daemon.configuration.instance.health.ro

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import java.util.*

data class InstanceHealthRO(
    val instanceId: UUID,
    val status: InstanceHealthStatus,
    val statusText: String?,
    val lastUpdateTime: Date,
    val lastStatusChangeTime: Date,
    val statusCode: Int? = null
) {
    companion object {
        private const val STALE_THRESHOLD_MS = 300_000 // 5 minutes
        fun InstanceHealthRO.isStale(): Boolean {
            return lastUpdateTime.time + STALE_THRESHOLD_MS < System.currentTimeMillis()
        }

        fun up(instanceId: UUID, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.UP,
            null,
            Date(),
            Date(),
            statusCode
        )

        fun down(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.DOWN,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun outOfService(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.OUT_OF_SERVICE,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun unreachable(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.UNREACHABLE,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun pending(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.PENDING,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun invalid(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.INVALID,
            statusText,
            Date(),
            Date(),
            statusCode
        )

        fun unknown(instanceId: UUID, statusText: String? = null, statusCode: Int? = null) = InstanceHealthRO(
            instanceId,
            InstanceHealthStatus.UNKNOWN,
            statusText,
            Date(),
            Date(),
            statusCode
        )
    }
}