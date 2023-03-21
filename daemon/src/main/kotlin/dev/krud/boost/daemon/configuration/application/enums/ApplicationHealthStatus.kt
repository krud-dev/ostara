package dev.krud.boost.daemon.configuration.application.enums

import dev.krud.boost.daemon.configuration.instance.enums.InstanceHealthStatus

enum class ApplicationHealthStatus {
    ALL_UP,
    ALL_DOWN,
    SOME_DOWN,
    UNKNOWN,
    PENDING,
    EMPTY;

    companion object {
        fun Collection<InstanceHealthStatus?>.toApplicationHealthStatus(): ApplicationHealthStatus {
            if (this.isEmpty()) {
                return EMPTY
            }

            val withoutNulls = this.filterNotNull()

            if (withoutNulls.any { it in listOf(InstanceHealthStatus.UNKNOWN, InstanceHealthStatus.PENDING) }) {
                return PENDING
            }

            if (withoutNulls.all { it == InstanceHealthStatus.UP }) {
                return ALL_UP
            }

            if (withoutNulls.all { it in listOf(InstanceHealthStatus.DOWN, InstanceHealthStatus.UNREACHABLE, InstanceHealthStatus.INVALID, InstanceHealthStatus.OUT_OF_SERVICE) }) {
                return ALL_DOWN
            }

            return SOME_DOWN
        }
    }
}