package dev.krud.boost.daemon.util

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager

fun TestEntityManager.persistAndGetInstance(alias: String? = "test-application", actuatorUrl: String = "http://localhost:8080/actuator", parentApplication: Application = persistAndGetApplication()): Instance {
    val instance = Instance(
        alias,
        actuatorUrl,
        parentApplication.id
    )
    return persistFlushFind(instance)
}

fun TestEntityManager.persistAndGetApplication(alias: String = "test-application", description: String = "N/A", applicationType: ApplicationType = ApplicationType.SPRING_BOOT): Application {
    val application = Application(
        alias,
        description,
        applicationType
    )
    return persistFlushFind(application)
}