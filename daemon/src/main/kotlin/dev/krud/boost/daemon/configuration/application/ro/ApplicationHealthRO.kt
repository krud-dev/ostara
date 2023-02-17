package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus
import java.util.*

data class ApplicationHealthRO(
    val status: ApplicationHealthStatus,
    val lastUpdateTime: Date,
    val lastStatusChangeTime: Date
) {
    companion object {
        fun allUp() = ApplicationHealthRO(
            ApplicationHealthStatus.ALL_UP,
            Date(),
            Date()
        )

        fun allDown() = ApplicationHealthRO(
            ApplicationHealthStatus.ALL_DOWN,
            Date(),
            Date()
        )

        fun someDown() = ApplicationHealthRO(
            ApplicationHealthStatus.SOME_DOWN,
            Date(),
            Date()
        )

        fun unknown() = ApplicationHealthRO(
            ApplicationHealthStatus.UNKNOWN,
            Date(),
            Date()
        )

        fun pending() = ApplicationHealthRO(
            ApplicationHealthStatus.PENDING,
            Date(),
            Date()
        )
    }
}