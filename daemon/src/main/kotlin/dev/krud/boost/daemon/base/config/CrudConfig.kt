package dev.krud.boost.daemon.base.config

import dev.krud.crudframework.crud.handler.krud.EnableKrud
import org.springframework.context.annotation.Configuration

@Configuration
@EnableKrud(["dev.krud.boost.daemon"])
class CrudConfig