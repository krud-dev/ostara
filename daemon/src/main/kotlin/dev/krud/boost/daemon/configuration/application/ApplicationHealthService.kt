package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationHealthStatus.Companion.toApplicationHealthStatus
import dev.krud.boost.daemon.configuration.application.ro.ApplicationHealthRO
import dev.krud.boost.daemon.configuration.instance.health.InstanceHealthService
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class ApplicationHealthService(
    private val applicationService: ApplicationService,
    private val instanceHealthService: InstanceHealthService
) {
    fun getCachedHealth(application: Application): ApplicationHealthRO {
        if (application.instances.isEmpty()) {
            return ApplicationHealthRO.pending()
        }
        val statuses = application.instances.map { instanceHealthService.getCachedHealth(it).status }
        return ApplicationHealthRO(
            statuses.toApplicationHealthStatus(),
            LocalDateTime.now(),
            LocalDateTime.now()
        )
    }

    fun getLiveHealth(applicationId: UUID): ApplicationHealthRO {
        val application = applicationService.getApplicationOrThrow(applicationId)
        if (application.instances.isEmpty()) {
            return ApplicationHealthRO.pending()
        }
        val statuses = application.instances.map { instanceHealthService.getLiveHealth(it).status }
        return ApplicationHealthRO(
            statuses.toApplicationHealthStatus(),
            LocalDateTime.now(),
            LocalDateTime.now()
        )
    }
}