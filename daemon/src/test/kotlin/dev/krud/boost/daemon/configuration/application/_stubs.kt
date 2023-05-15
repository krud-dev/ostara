package dev.krud.boost.daemon.configuration.application

import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.enums.ApplicationType
import dev.krud.boost.daemon.configuration.authentication.Authentication
import java.util.*

fun stubApplication(id: UUID = UUID.randomUUID(), alias: String = "stubApplication", authentication: Authentication = Authentication.Inherit.DEFAULT, parentFolderId: UUID? = null, type: ApplicationType = ApplicationType.SPRING_BOOT, demo: Boolean = false): Application {
    return Application(
        alias = alias,
        authentication = authentication,
        parentFolderId = parentFolderId,
        type = type
    ).apply {
        this.id = id
        this.demo = demo
    }
}