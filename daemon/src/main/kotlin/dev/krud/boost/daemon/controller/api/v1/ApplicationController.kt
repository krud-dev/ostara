package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.application.ro.ApplicationModifyRequestRO
import dev.krud.boost.daemon.configuration.application.entity.Application
import dev.krud.boost.daemon.configuration.application.ro.ApplicationRO
import dev.krud.crudframework.crud.handler.CrudHandler
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_PREFIX/applications")
@Tag(name = "Application", description = "Application API")
class ApplicationController(
    private val crudHandler: CrudHandler
) : AbstractCrudController<Application, ApplicationRO, ApplicationModifyRequestRO, ApplicationModifyRequestRO>(Application::class, ApplicationRO::class, crudHandler)