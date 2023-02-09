package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.crudframework.crud.handler.CrudHandler
import org.springframework.stereotype.Service
import java.util.*

@Service
class ApplicationService(
    private val crudHandler: CrudHandler
) {
    fun getApplication(applicationId: UUID): Application? {
        return crudHandler
            .show(applicationId, Application::class.java)
            .execute()
    }

    fun getApplicationOrThrow(applicationId: UUID): Application {
        return getApplication(applicationId) ?: error("Application $applicationId not found")
    }
}