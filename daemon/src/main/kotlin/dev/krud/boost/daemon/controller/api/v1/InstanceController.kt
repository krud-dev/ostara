package dev.krud.boost.daemon.controller.api.v1

import dev.krud.boost.daemon.configuration.instance.dto.InstanceModifyRequestDTO
import dev.krud.boost.daemon.configuration.instance.entity.Instance
import dev.krud.boost.daemon.configuration.instance.ro.InstanceRO
import dev.krud.crudframework.crud.handler.CrudHandler
import io.swagger.v3.oas.annotations.tags.Tag
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("$API_PREFIX/instances")
@Tag(name = "Instance", description = "Instance API")
class InstanceController(
    private val crudHandler: CrudHandler
) : AbstractCrudController<Instance, InstanceRO, InstanceModifyRequestDTO, InstanceModifyRequestDTO>(Instance::class, InstanceRO::class, crudHandler)