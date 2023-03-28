package dev.krud.boost.daemon.configuration.application.ro

import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus
import java.util.*

data class ApplicationHealthRO(
    val applicationId: UUID,
    val status: ApplicationHealthStatus,
    val lastUpdateTime: Date = Date(),
    val lastStatusChangeTime: Date = Date()
) {
    companion object {
        fun allUp(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.ALL_UP,
            Date(),
            Date()
        )

        fun allDown(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.ALL_DOWN,
            Date(),
            Date()
        )

        fun someDown(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.SOME_DOWN,
            Date(),
            Date()
        )

        fun unknown(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.UNKNOWN,
            Date(),
            Date()
        )

        fun pending(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.PENDING,
            Date(),
            Date()
        )

        fun empty(applicationId: UUID) = ApplicationHealthRO(
            applicationId,
            ApplicationHealthStatus.EMPTY,
            Date(),
            Date()
        )
    }
}