package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus
import java.time.LocalDateTime

data class ApplicationHealthRO(
    val status: ApplicationHealthStatus,
    val lastUpdateTime: LocalDateTime,
    val lastStatusChangeTime: LocalDateTime
) {
    companion object {
        fun allUp() = ApplicationHealthRO(
            ApplicationHealthStatus.ALL_UP,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun allDown() = ApplicationHealthRO(
            ApplicationHealthStatus.ALL_DOWN,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun someDown() = ApplicationHealthRO(
            ApplicationHealthStatus.SOME_DOWN,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun unknown() = ApplicationHealthRO(
            ApplicationHealthStatus.UNKNOWN,
            LocalDateTime.now(),
            LocalDateTime.now()
        )

        fun pending() = ApplicationHealthRO(
            ApplicationHealthStatus.PENDING,
            LocalDateTime.now(),
            LocalDateTime.now()
        )
    }
}