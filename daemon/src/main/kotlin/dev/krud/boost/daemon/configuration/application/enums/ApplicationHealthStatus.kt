package dev.krud.boost.daemon.configuration.application.enums

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus
import dev.krud.boost.daemon.configuration.instance.health.ro.InstanceHealthRO

enum class ApplicationHealthStatus {
    ALL_UP,
    ALL_DOWN,
    SOME_DOWN,
    UNKNOWN,
    PENDING,
    EMPTY;

    companion object {
        @JvmName("toApplicationHealthStatusFromRO")
        fun Collection<InstanceHealthRO>.toApplicationHealthStatus(): ApplicationHealthStatus {
            return map {
                it.status
            }
                .toApplicationHealthStatus()
        }
        fun Collection<InstanceHealthStatus?>.toApplicationHealthStatus(): ApplicationHealthStatus {
            if (this.isEmpty()) {
                return EMPTY
            }

            val withoutNulls = this.filterNotNull()

            if (withoutNulls.any { it == InstanceHealthStatus.PENDING }) {
                return PENDING
            }

            if (withoutNulls.all { it == InstanceHealthStatus.UP }) {
                return ALL_UP
            }

            if (withoutNulls.all { it in listOf(InstanceHealthStatus.DOWN, InstanceHealthStatus.UNREACHABLE, InstanceHealthStatus.INVALID, InstanceHealthStatus.OUT_OF_SERVICE) }) {
                return ALL_DOWN
            }

            if (withoutNulls.all { it == InstanceHealthStatus.UNKNOWN }) {
                return UNKNOWN
            }

            return SOME_DOWN
        }
    }
}